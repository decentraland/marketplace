import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChainId, NFTCategory, Network } from '@dcl/schemas'
import { EstateSnapshotState, EstateSnapshotStatus, useEstateSnapshot } from '../../../modules/nft/hooks'
import { renderWithProviders } from '../../../utils/test'
import BidModal from './BidModal'
import { Props } from './BidModal.types'

// Partial: `isEstateSnapshotBlocking` and the status enum must stay real, or the component's own
// gating is mocked away along with the hook under test.
jest.mock('../../../modules/nft/hooks', () => ({
  ...jest.requireActual<typeof import('../../../modules/nft/hooks')>('../../../modules/nft/hooks'),
  useEstateSnapshot: jest.fn()
}))

// The HOC only supplies `onAuthorizedAction`, which the spec passes itself so it can drive the
// authorized callback directly. Identity keeps the component under test unwrapped.
jest.mock('decentraland-dapps/dist/containers', () => ({
  withAuthorizedAction: (Component: React.ComponentType) => Component,
  ChainButton: ({
    children,
    disabled,
    onClick,
    type
  }: {
    children: React.ReactNode
    disabled?: boolean
    onClick?: () => void
    type?: 'submit'
  }) => (
    <button disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  )
}))

// Presentation only: it renders the Atlas, which is not what this spec is about.
jest.mock('../../AssetAction', () => ({
  AssetAction: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

jest.mock('../../../utils/trades', () => ({
  getLatestOffChainMarketplaceContract: () => ({ address: '0xoffchain', name: 'OffChainMarketplaceV2' })
}))

const mockedUseEstateSnapshot = useEstateSnapshot as jest.MockedFunction<typeof useEstateSnapshot>

const FROZEN_FINGERPRINT = '0xa7fe55af6f4ca09a346312be9b76dba38436d52611e279e09440d564a457115e'

function renderBidModal(estate: Partial<EstateSnapshotState>, overrides: Partial<Props> = {}) {
  const confirm = jest.fn().mockResolvedValue(true)
  const retry = jest.fn()
  mockedUseEstateSnapshot.mockReturnValue({ status: EstateSnapshotStatus.READY, confirm, retry, ...estate } as EstateSnapshotState)

  const onPlaceBid = jest.fn()
  const onAuthorizedAction = jest.fn()

  const props = {
    asset: {
      id: 'an-estate',
      tokenId: '6503',
      contractAddress: '0xestate',
      category: NFTCategory.ESTATE,
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_MAINNET,
      data: { estate: { size: 2, parcels: [], description: null } }
    },
    rental: null,
    wallet: { address: '0xbidder', networks: { [Network.ETHEREUM]: { mana: 10000 }, [Network.MATIC]: { mana: 0 } } },
    isPlacingBid: false,
    isLoadingAuthorization: false,
    getContract: ({ name }: { name?: string }) => ({ address: `0x${name ?? 'c'}`, name, label: name }),
    onNavigate: jest.fn(),
    onPlaceBid,
    onClearBidError: jest.fn(),
    onAuthorizedAction,
    ...overrides
  } as unknown as Props

  renderWithProviders(<BidModal {...props} />)
  return { confirm, onPlaceBid, onAuthorizedAction }
}

/** Fills the form and walks the confirmation through to the authorized callback. */
async function submitBid(onAuthorizedAction: jest.Mock) {
  await userEvent.type(screen.getByPlaceholderText('1000'), '100')
  await userEvent.click(screen.getByRole('button', { name: 'Bid' }))
  // The confirmation makes the bidder re-enter the amount before Proceed is enabled.
  await userEvent.type(screen.getByPlaceholderText('100'), '100')
  await userEvent.click(screen.getByRole('button', { name: 'Proceed' }))

  await waitFor(() => expect(onAuthorizedAction).toHaveBeenCalled())
  const { onAuthorized } = onAuthorizedAction.mock.calls[0][0] as { onAuthorized: () => void }
  onAuthorized()
}

describe('when the estate composition on screen is the one the registry holds', () => {
  it('should place the bid against the fingerprint that was frozen, not one read at signing time', async () => {
    const { confirm, onPlaceBid, onAuthorizedAction } = renderBidModal({
      status: EstateSnapshotStatus.READY,
      fingerprint: FROZEN_FINGERPRINT
    })

    await submitBid(onAuthorizedAction)

    await waitFor(() => expect(onPlaceBid).toHaveBeenCalled())
    expect(confirm).toHaveBeenCalled()
    expect(onPlaceBid.mock.calls[0][3]).toBe(FROZEN_FINGERPRINT)
  })
})

// The whole point of the guard: if the composition moved between the snapshot and the signature,
// nothing is signed.
describe('when the composition moved between the snapshot and the signature', () => {
  it('should not place the bid, and should say why', async () => {
    const confirm = jest.fn().mockResolvedValue(false)
    const { onPlaceBid, onAuthorizedAction } = renderBidModal({
      status: EstateSnapshotStatus.READY,
      fingerprint: FROZEN_FINGERPRINT,
      confirm
    })

    await submitBid(onAuthorizedAction)

    await waitFor(() => expect(screen.getByText(/changed while you were reviewing it/i)).toBeInTheDocument())
    expect(onPlaceBid).not.toHaveBeenCalled()
  })
})

describe.each([
  [EstateSnapshotStatus.LOADING, {}],
  [EstateSnapshotStatus.UNAVAILABLE, {}],
  [EstateSnapshotStatus.OUT_OF_SYNC, { snapshot: { blockNumber: 1, landIds: [], parcels: [], fingerprint: '0x0' } }]
])('when the estate composition is %s', (status, extra) => {
  it('should not let the bid be submitted', async () => {
    renderBidModal({ status, ...extra } as Partial<EstateSnapshotState>)

    await userEvent.type(screen.getByPlaceholderText('1000'), '100')

    expect(screen.getByRole('button', { name: 'Bid' })).toBeDisabled()
  })
})
