import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChainId, NFTCategory, Network, Order } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { EstateSnapshotState, EstateSnapshotStatus, useEstateSnapshot } from '../../../../modules/nft/hooks'
import { CheckoutPrice, useCheckoutPriceInMana } from '../../../../modules/trade/hooks'
import { BuyNftWithCryptoModal } from './BuyNftWithCryptoModal'
import { Props } from './BuyNftWithCryptoModal.types'

jest.mock('../../../../modules/trade/hooks')

// The estate snapshot is the thing under test; keep the rest of the module real so the
// component's own gating (`isEstateSnapshotBlocking`) runs.
jest.mock('../../../../modules/nft/hooks', () => ({
  ...jest.requireActual<typeof import('../../../../modules/nft/hooks')>('../../../../modules/nft/hooks'),
  useEstateSnapshot: jest.fn()
}))

// The HOC only supplies `onAuthorizedAction`, which the spec passes itself to drive the authorized
// callback. Identity keeps the component under test unwrapped.
jest.mock('decentraland-dapps/dist/containers/withAuthorizedAction', () => ({
  __esModule: true,
  default: (Component: React.ComponentType) => Component,
  AuthorizedAction: { BUY: 'BUY' }
}))

jest.mock('decentraland-transactions', () => ({
  ...jest.requireActual<typeof import('decentraland-transactions')>('decentraland-transactions'),
  getContract: () => ({ address: '0xmarketplace', name: 'OffChainMarketplaceV2' }),
  getContractName: () => 'OffChainMarketplaceV2'
}))

// The shared confirmation modal is replaced by a probe that exposes the buy action.
jest.mock('../BuyWithCryptoModal.container', () => ({
  __esModule: true,
  default: (props: { onBuyNatively: () => void }) => (
    <div data-testid="confirmation">
      <button onClick={props.onBuyNatively}>buy</button>
    </div>
  )
}))

const mockedUseCheckoutPriceInMana = useCheckoutPriceInMana as jest.MockedFunction<typeof useCheckoutPriceInMana>
const mockedUseEstateSnapshot = useEstateSnapshot as jest.MockedFunction<typeof useEstateSnapshot>

const FROZEN_FINGERPRINT = '0xa7fe55af6f4ca09a346312be9b76dba38436d52611e279e09440d564a457115e'

function renderModal(estate: Partial<EstateSnapshotState>, overrides: Partial<Props> = {}) {
  mockedUseCheckoutPriceInMana.mockReturnValue({
    status: 'ready',
    manaWei: '1000000000000000000000',
    isUSDPegged: false
  } as CheckoutPrice)

  const confirm = jest.fn().mockResolvedValue(true)
  const retry = jest.fn()
  mockedUseEstateSnapshot.mockReturnValue({ status: EstateSnapshotStatus.READY, confirm, retry, ...estate } as EstateSnapshotState)

  const nft = {
    id: 'an-estate',
    tokenId: '6503',
    contractAddress: '0xestate',
    category: NFTCategory.ESTATE,
    network: Network.ETHEREUM,
    chainId: ChainId.ETHEREUM_MAINNET,
    data: { estate: { size: 2, parcels: [], description: null } }
  }
  const order = {
    price: '1000000000000000000000',
    chainId: ChainId.ETHEREUM_MAINNET,
    marketplaceAddress: '0xmarketplace',
    tradeId: 'a-trade'
  } as unknown as Order

  const onExecuteOrder = jest.fn()
  const onAuthorizedAction = jest.fn()

  const props = {
    name: 'BuyNftWithCryptoModal',
    metadata: { nft, order, useCredits: false },
    credits: null,
    connectedChainId: ChainId.ETHEREUM_MAINNET,
    isExecutingOrder: false,
    isExecutingOrderCrossChain: false,
    getContract: () => ({ address: '0xmana', name: 'MANAToken' }) as never,
    onExecuteOrder,
    onExecuteOrderCrossChain: jest.fn(),
    onExecuteOrderWithCard: jest.fn(),
    onAuthorizedAction,
    onClose: jest.fn(),
    ...overrides
  } as unknown as Props

  render(
    <MemoryRouter>
      <BuyNftWithCryptoModal {...props} />
    </MemoryRouter>
  )
  return { confirm, onExecuteOrder, onAuthorizedAction }
}

/** Presses buy and walks through the authorization callback the modal registers. */
async function buy(onAuthorizedAction: jest.Mock) {
  await userEvent.click(screen.getByRole('button', { name: 'buy' }))
  await waitFor(() => expect(onAuthorizedAction).toHaveBeenCalled())
  const { onAuthorized } = onAuthorizedAction.mock.calls[0][0] as { onAuthorized: (alreadyAuthorized: boolean) => void }
  onAuthorized(true)
}

describe('when the estate composition on screen is the one the registry holds', () => {
  it('should show the confirmation and execute against the frozen fingerprint', async () => {
    const { confirm, onExecuteOrder, onAuthorizedAction } = renderModal({
      status: EstateSnapshotStatus.READY,
      fingerprint: FROZEN_FINGERPRINT
    })

    expect(screen.getByTestId('confirmation')).toBeInTheDocument()
    await buy(onAuthorizedAction)

    await waitFor(() => expect(onExecuteOrder).toHaveBeenCalled())
    expect(confirm).toHaveBeenCalled()
    expect(onExecuteOrder.mock.calls[0][2]).toBe(FROZEN_FINGERPRINT)
  })
})

describe('when the composition moved between opening the checkout and signing', () => {
  it('should not execute the order, and should show why', async () => {
    const confirm = jest.fn().mockResolvedValue(false)
    const { onExecuteOrder, onAuthorizedAction } = renderModal({
      status: EstateSnapshotStatus.READY,
      fingerprint: FROZEN_FINGERPRINT,
      confirm
    })

    await buy(onAuthorizedAction)

    await waitFor(() => expect(screen.getByText(t('estate_composition.changed'))).toBeInTheDocument())
    expect(onExecuteOrder).not.toHaveBeenCalled()
  })
})

describe.each([
  [EstateSnapshotStatus.LOADING, undefined],
  [EstateSnapshotStatus.UNAVAILABLE, undefined],
  [EstateSnapshotStatus.OUT_OF_SYNC, { blockNumber: 1, landIds: [], parcels: [{ x: 0, y: 0 }], fingerprint: '0x0' }]
])('when the estate composition is %s', (status, snapshot) => {
  it('should block the checkout instead of showing the confirmation', () => {
    renderModal({ status, snapshot } as Partial<EstateSnapshotState>)

    expect(screen.queryByTestId('confirmation')).not.toBeInTheDocument()
    expect(screen.getByText(t('estate_composition.modal_title'))).toBeInTheDocument()
  })
})

describe('when the registry could not be read', () => {
  it('should offer a retry', () => {
    const retry = jest.fn()
    renderModal({ status: EstateSnapshotStatus.UNAVAILABLE, retry })

    expect(screen.getByRole('button', { name: t('estate_composition.retry') })).toBeInTheDocument()
  })
})
