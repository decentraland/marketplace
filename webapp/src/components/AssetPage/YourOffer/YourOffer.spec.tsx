import { screen } from '@testing-library/react'
import { Bid, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Asset } from '../../../modules/asset/types'
import { renderWithProviders } from '../../../utils/test'
import YourOffer from './YourOffer'
import { Props } from './YourOffer.types'

jest.mock('../../ManaToFiat', () => ({ ManaToFiat: () => <span /> }))

describe('when rendering the offer of the connected address', () => {
  let props: Props
  let pausedBid: Bid
  let activeBid: Bid

  beforeEach(() => {
    pausedBid = {
      id: 'paused-bid',
      tradeId: 'paused-trade',
      bidder: '0xbidder',
      price: '9000000000000000000',
      network: Network.MATIC,
      createdAt: 0,
      expiresAt: 0,
      isPaused: true
    } as Bid
    activeBid = { ...pausedBid, id: 'active-bid', tradeId: 'active-trade', price: '3000000000000000000', isPaused: false }
    props = {
      asset: { contractAddress: '0xcontract', tokenId: '1' } as Asset,
      address: '0xbidder',
      bids: [],
      onCancel: jest.fn(),
      onFetchBids: jest.fn()
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('and their only offer is on a paused marketplace contract', () => {
    beforeEach(() => {
      props.bids = [pausedBid]
      renderWithProviders(<YourOffer {...props} />)
    })

    it('should ask the bidder to cancel it and make a new offer', () => {
      expect(screen.getByRole('alert')).toHaveTextContent(t('trading_paused_warning.bid_bidder'))
    })
  })

  describe('and they replaced an offer on a paused marketplace contract', () => {
    beforeEach(() => {
      props.bids = [pausedBid, activeBid]
      renderWithProviders(<YourOffer {...props} />)
    })

    it('should not render the paused warning', () => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should show the active offer', () => {
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })
})
