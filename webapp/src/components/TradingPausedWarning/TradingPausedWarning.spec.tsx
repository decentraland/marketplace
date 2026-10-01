import { screen } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../utils/test'
import TradingPausedWarning from './TradingPausedWarning'
import { Props, TradingPausedWarningVariant } from './TradingPausedWarning.types'

describe('when rendering the trading paused warning', () => {
  let props: Props

  describe('and the listing is not paused', () => {
    beforeEach(() => {
      props = { listing: { paused: false } }
      renderWithProviders(<TradingPausedWarning {...props} />)
    })

    it('should render nothing', () => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('and the listing has no paused flag', () => {
    beforeEach(() => {
      props = { listing: {} }
      renderWithProviders(<TradingPausedWarning {...props} />)
    })

    it('should render nothing', () => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('and the listing is paused', () => {
    describe('and it is shown to a buyer', () => {
      beforeEach(() => {
        props = { listing: { paused: true } }
        renderWithProviders(<TradingPausedWarning {...props} />)
      })

      it('should render an alert explaining that purchases are unavailable', () => {
        expect(screen.getByRole('alert')).toHaveTextContent(t('trading_paused_warning.visitor'))
      })
    })

    describe('and it is shown to the lister', () => {
      beforeEach(() => {
        props = { listing: { paused: true }, isOwnListing: true }
        renderWithProviders(<TradingPausedWarning {...props} />)
      })

      it('should render an alert asking to cancel and list again', () => {
        expect(screen.getByRole('alert')).toHaveTextContent(t('trading_paused_warning.owner'))
      })
    })

    describe('and it is a primary sale shown to a buyer', () => {
      beforeEach(() => {
        props = { listing: { paused: true }, variant: TradingPausedWarningVariant.ITEM }
        renderWithProviders(<TradingPausedWarning {...props} />)
      })

      it('should render an alert explaining that purchases of the item are unavailable', () => {
        expect(screen.getByRole('alert')).toHaveTextContent(t('trading_paused_warning.item_visitor'))
      })
    })

    describe('and it is a bid shown to the seller', () => {
      beforeEach(() => {
        props = { listing: { paused: true }, variant: TradingPausedWarningVariant.BID }
        renderWithProviders(<TradingPausedWarning {...props} />)
      })

      it('should render an alert explaining that the offer cannot be accepted', () => {
        expect(screen.getByRole('alert')).toHaveTextContent(t('trading_paused_warning.bid_seller'))
      })
    })

    describe('and it is a bid shown to the bidder', () => {
      beforeEach(() => {
        props = { listing: { paused: true }, variant: TradingPausedWarningVariant.BID, isOwnListing: true }
        renderWithProviders(<TradingPausedWarning {...props} />)
      })

      it('should render an alert asking to cancel and make a new offer', () => {
        expect(screen.getByRole('alert')).toHaveTextContent(t('trading_paused_warning.bid_bidder'))
      })
    })
  })
})
