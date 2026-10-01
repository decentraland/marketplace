import { Bid } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet'
import { Item } from '../../../../modules/item/types'
import { renderWithProviders } from '../../../../utils/test'
import ItemSaleActions from './ItemSaleActions'
import { Props } from './ItemSaleActions.types'

function renderItemSaleActions(props: Partial<Props> = {}) {
  return renderWithProviders(
    <ItemSaleActions
      item={{ id: 'dasd', available: 2, creator: '0xcreator' } as Item}
      wallet={{ address: '0xtest' } as Wallet}
      onUseCredits={jest.fn()}
      bids={[]}
      onFetchBids={jest.fn()}
      {...props}
    />
  )
}

let props: Partial<Props> = {}

describe('when off chain bids are enabled', () => {
  describe('and the user is not the creator of the item', () => {
    beforeEach(() => {
      props = { ...props, wallet: { address: '0xuser' } as Wallet, item: { id: '1', creator: '0xcreator' } as Item }
    })

    describe('and slots available to mint', () => {
      beforeEach(() => {
        props = { ...props, item: { ...props.item, available: 2 } as Item }
      })

      it('should render the bid button', () => {
        const { getByTestId } = renderItemSaleActions(props)
        expect(getByTestId('bid-button')).toBeInTheDocument()
      })
    })

    describe('and the user only has a bid on a paused marketplace contract', () => {
      beforeEach(() => {
        props = { ...props, item: { ...props.item, available: 2 } as Item, bids: [{ bidder: '0xuser', isPaused: true } as Bid] }
      })

      afterEach(() => {
        props = { ...props, bids: [] }
      })

      it('should let the user make a new offer', () => {
        const { getByTestId } = renderItemSaleActions(props)
        expect(getByTestId('bid-button')).toHaveTextContent(t('bid_button.bid'))
      })
    })

    describe('and the user has a bid on an active marketplace contract', () => {
      beforeEach(() => {
        props = { ...props, item: { ...props.item, available: 2 } as Item, bids: [{ bidder: '0xuser' } as Bid] }
      })

      afterEach(() => {
        props = { ...props, bids: [] }
      })

      it('should lock the offer button', () => {
        const { getByTestId } = renderItemSaleActions(props)
        expect(getByTestId('bid-button')).toHaveTextContent(t('bid_button.blocked'))
      })
    })

    describe('and there are no slots available to mint', () => {
      beforeEach(() => {
        props = { ...props, item: { ...props.item, available: 0 } as Item }
      })

      it('should not render the bid button', () => {
        const { queryByTestId } = renderItemSaleActions(props)
        expect(queryByTestId('bid-button')).not.toBeInTheDocument()
      })
    })
  })

  describe('and the user is the creator of the item', () => {
    beforeEach(() => {
      props = { ...props, wallet: { address: '0xcreator' } as Wallet, item: { id: '1', creator: '0xcreator' } as Item }
    })

    it('should not render the bid button', () => {
      const { queryByTestId } = renderItemSaleActions(props)
      expect(queryByTestId('bid-button')).not.toBeInTheDocument()
    })
  })
})

describe('when off chain bids are disabled', () => {
  it('should not render the bid button', () => {
    const { queryByRole } = renderItemSaleActions(props)
    expect(queryByRole('link', { name: t('asset_page.actions.place_bid') })).not.toBeInTheDocument()
  })
})
