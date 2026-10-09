import { screen, waitFor } from '@testing-library/react'
import { Bid, ChainId, Network } from '@dcl/schemas'
import { isInsufficientMANA } from '../../../modules/bid/utils'
import { NFT } from '../../../modules/nft/types'
import { renderWithProviders } from '../../../utils/test'
import AcceptButton from './AcceptButton'
import { Props } from './AcceptButton.types'

jest.mock('../../../modules/nft/hooks', () => ({
  useFingerprint: () => [undefined, false]
}))

jest.mock('../../../modules/bid/utils', () => ({
  ...jest.requireActual<typeof import('../../../modules/bid/utils')>('../../../modules/bid/utils'),
  isInsufficientMANA: jest.fn()
}))

const mockedIsInsufficientMANA = isInsufficientMANA as jest.MockedFunction<typeof isInsufficientMANA>

describe('when rendering the accept bid button', () => {
  let props: Props

  beforeEach(() => {
    mockedIsInsufficientMANA.mockResolvedValue(false)
    props = {
      asset: {
        id: 'an-nft',
        contractAddress: '0xcontract',
        tokenId: '1',
        owner: '0xseller',
        chainId: ChainId.MATIC_MAINNET,
        network: Network.MATIC,
        data: {}
      } as unknown as NFT,
      rental: null,
      bid: { id: 'a-bid', bidder: '0xbidder', seller: '0xseller', price: '1', tradeId: 'a-trade' } as Bid,
      userAddress: '0xseller',
      onClick: jest.fn()
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('and the bid is on a paused marketplace contract', () => {
    beforeEach(async () => {
      props.bid = { ...props.bid, isPaused: true }
      renderWithProviders(<AcceptButton {...props} />)
      await waitFor(() => expect(mockedIsInsufficientMANA).toHaveBeenCalled())
    })

    it('should disable the accept button', () => {
      expect(screen.getByRole('button', { name: 'Accept' })).toBeDisabled()
    })
  })

  describe('and the bid is on an active marketplace contract', () => {
    beforeEach(async () => {
      renderWithProviders(<AcceptButton {...props} />)
      await waitFor(() => expect(mockedIsInsufficientMANA).toHaveBeenCalled())
    })

    it('should enable the accept button', () => {
      expect(screen.getByRole('button', { name: 'Accept' })).toBeEnabled()
    })
  })
})
