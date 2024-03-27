import { Bid, Order } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'
import { renderWithProviders } from '../../../utils/test'
import Actions from './Actions'
import { Props } from './Actions.types'

describe('Actions Component', () => {
  let props: Props
  let nft: NFT
  let wallet: Wallet
  let order: Order | null
  let bids: Bid[]
  let onBuyWithCrypto: (order: Order) => void
  let onLeavingSite
  let address: string

  beforeEach(() => {
    address = '0xAnAddress'
    wallet = { address: 'user-wallet-address' } as Wallet
    nft = {
      contractAddress: 'nft-contract-address',
      tokenId: 'nft-token-id',
      vendor: VendorName.DECENTRALAND,
      data: {}
    } as NFT
    // order = null
    bids = []
    onBuyWithCrypto = jest.fn()
    onLeavingSite = jest.fn()
    props = {
      wallet,
      nft,
      order,
      bids,
      onBuyWithCrypto,
      onLeavingSite
    }
  })

  describe('and it has an order', () => {
    beforeEach(() => {
      order = {} as Order
    })
    describe('and it is owner and can sell', () => {
      beforeEach(() => {
        nft.owner = address
        wallet.address = nft.owner
      })
      it('should render the update and the cancel sale button', () => {
        const { queryByText } = renderWithProviders(<Actions {...props} order={order} />)
        const updateButton = queryByText(t('asset_page.actions.update'))
        const cancelButton = queryByText(t('asset_page.actions.cancel_sale'))
        expect(updateButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()
      })
    })
    describe('and its not the owner', () => {
      beforeEach(() => {
        nft.owner = '0xAnotherAddress'
        wallet.address = address
      })
      it('should render the bid button and not render the update and the cancel sale button', () => {
        const { queryByText } = renderWithProviders(<Actions {...props} order={order} />)
        const bidButton = queryByText(t('asset_page.actions.bid'))
        const updateButton = queryByText(t('asset_page.actions.update'))
        const cancelButton = queryByText(t('asset_page.actions.cancel_sale'))
        expect(bidButton).toBeInTheDocument()
        expect(updateButton).not.toBeInTheDocument()
        expect(cancelButton).not.toBeInTheDocument()
      })
    })
  })
  describe('and there is no order', () => {
    beforeEach(() => {
      order = null
    })
    describe('and its the owner', () => {
      beforeEach(() => {
        nft.owner = address
        wallet.address = nft.owner
      })
      describe('and its an ENS name', () => {
        beforeEach(() => {
          nft.data.ens = { subdomain: '' }
        })
        it('should render the manage button', () => {
          const { queryByText } = renderWithProviders(<Actions {...props} order={order} />)
          const manageButton = queryByText(t('asset_page.actions.manage'))
          expect(manageButton).toBeInTheDocument()
        })
      })
      it('should render the sell and transfer button', () => {
        const { queryByText } = renderWithProviders(<Actions {...props} order={order} />)
        const sellButton = queryByText(t('asset_page.actions.sell'))
        const transferButton = queryByText(t('asset_page.actions.transfer'))
        expect(sellButton).toBeInTheDocument()
        expect(transferButton).toBeInTheDocument()
      })
    })
    describe('and it is not the owner', () => {
      beforeEach(() => {
        nft.owner = '0xAnotherAddress'
        wallet.address = address
      })
      it('should render the bid button', () => {
        const { queryByText } = renderWithProviders(<Actions {...props} order={order} />)
        const bidButton = queryByText(t('asset_page.actions.bid'))
        expect(bidButton).toBeInTheDocument()
      })
    })
  })
})
