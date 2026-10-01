import { ChainId, NFTCategory, Network, Order, RentalListing, RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { STOLEN_NFT_KEYS } from '../../../lib/stolenNfts'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'
import { renderWithProviders } from '../../../utils/test'
import SaleRentActionBox from './SaleRentActionBox'
import { Props } from './SaleRentActionBox.types'

jest.mock('../../../modules/trade/hooks', () => ({
  useCheckoutPriceInMana: () => ({ status: 'ready', manaWei: '1', isUSDPegged: false })
}))
jest.mock('../SaleActionBox/BuyNFTButtons/BuyWithCryptoButton', () => ({
  BuyWithCryptoButton: ({ disabled }: { disabled?: boolean }) => <button data-testid="buy-with-crypto-button" disabled={disabled} />
}))
jest.mock('../../BidButton', () => ({ __esModule: true, default: () => <div data-testid="bid-button" /> }))
jest.mock('../../ListingPrice', () => ({ ListingPrice: () => <div /> }))
jest.mock('./PeriodsDropdown', () => ({ PeriodsDropdown: () => <div data-testid="periods-dropdown" /> }))

const [stolenChainId, stolenContractAddress, stolenTokenId] = STOLEN_NFT_KEYS.find(key => key.startsWith('1:'))!.split(':')

describe('SaleRentActionBox', () => {
  let props: Props
  let nft: NFT

  beforeEach(() => {
    nft = {
      id: 'a-parcel',
      contractAddress: '0xcontract',
      tokenId: '1',
      chainId: ChainId.ETHEREUM_MAINNET,
      network: Network.ETHEREUM,
      category: NFTCategory.PARCEL,
      owner: '0xowner',
      vendor: VendorName.DECENTRALAND,
      data: { parcel: { x: '1', y: '1', description: null } }
    } as NFT
    props = {
      nft,
      wallet: { address: '0xbuyer' } as Wallet,
      rental: null,
      order: { price: '1', network: Network.ETHEREUM, createdAt: Date.now() } as unknown as Order,
      userHasAlreadyBidsOnNft: false,
      currentMana: 10,
      isCrossChainLandEnabled: true,
      onRent: jest.fn(),
      onBuyWithCrypto: jest.fn()
    }
  })

  describe('when the nft was not reported as stolen', () => {
    it('should render the buy and the bid buttons', () => {
      const { getByTestId } = renderWithProviders(<SaleRentActionBox {...props} />)
      expect(getByTestId('buy-with-crypto-button')).toBeInTheDocument()
      expect(getByTestId('bid-button')).toBeInTheDocument()
    })
  })

  describe('when the order is on a paused marketplace contract', () => {
    beforeEach(() => {
      props.order = { ...props.order, paused: true } as Order
    })

    describe('and it is shown to a buyer', () => {
      it('should keep the buy button visible but disabled', () => {
        const { getByTestId } = renderWithProviders(<SaleRentActionBox {...props} />)
        expect(getByTestId('buy-with-crypto-button')).toBeDisabled()
      })

      it('should explain that purchases of the listing are unavailable', () => {
        const { getByRole } = renderWithProviders(<SaleRentActionBox {...props} />)
        expect(getByRole('alert')).toHaveTextContent(t('trading_paused_warning.visitor'))
      })
    })

    describe('and it is shown to the owner', () => {
      beforeEach(() => {
        props.wallet = { address: '0xowner' } as Wallet
      })

      it('should ask the owner to cancel and list again', () => {
        const { getByRole } = renderWithProviders(<SaleRentActionBox {...props} />)
        expect(getByRole('alert')).toHaveTextContent(t('trading_paused_warning.owner'))
      })
    })
  })

  describe('when the order is on an active marketplace contract', () => {
    it('should keep the buy button enabled', () => {
      const { getByTestId } = renderWithProviders(<SaleRentActionBox {...props} />)
      expect(getByTestId('buy-with-crypto-button')).toBeEnabled()
    })
  })

  describe('when the nft was reported as stolen', () => {
    beforeEach(() => {
      props.nft = { ...nft, chainId: Number(stolenChainId), contractAddress: stolenContractAddress, tokenId: stolenTokenId } as NFT
    })

    it('should not render the buy and the bid buttons', () => {
      const { queryByTestId } = renderWithProviders(<SaleRentActionBox {...props} />)
      expect(queryByTestId('buy-with-crypto-button')).not.toBeInTheDocument()
      expect(queryByTestId('bid-button')).not.toBeInTheDocument()
    })

    it('should not render the listing price', () => {
      const { queryByText } = renderWithProviders(<SaleRentActionBox {...props} />)
      expect(queryByText(t('global.price'))).not.toBeInTheDocument()
    })
  })

  describe('when the nft has an open rental listing', () => {
    beforeEach(() => {
      props.order = null
      props.rental = {
        id: 'a-rental',
        status: RentalStatus.OPEN,
        periods: [{ pricePerDay: '100000000000000000000', maxDays: 7, minDays: 7 }],
        network: Network.ETHEREUM,
        tenant: null,
        lessor: '0xowner'
      } as RentalListing
    })

    describe('and it was not reported as stolen', () => {
      it('should render the rent view', () => {
        const { getByTestId } = renderWithProviders(<SaleRentActionBox {...props} />)
        expect(getByTestId('periods-dropdown')).toBeInTheDocument()
      })
    })

    describe('and it was reported as stolen', () => {
      beforeEach(() => {
        props.nft = { ...nft, chainId: Number(stolenChainId), contractAddress: stolenContractAddress, tokenId: stolenTokenId } as NFT
      })

      it('should render the warning without any rent, buy or bid options', () => {
        const { getByTestId, queryByTestId, queryByText } = renderWithProviders(<SaleRentActionBox {...props} />)
        expect(getByTestId('stolen-nft-warning')).toBeInTheDocument()
        expect(queryByTestId('periods-dropdown')).not.toBeInTheDocument()
        expect(queryByText('Rent')).not.toBeInTheDocument()
        expect(queryByTestId('buy-with-crypto-button')).not.toBeInTheDocument()
        expect(queryByTestId('bid-button')).not.toBeInTheDocument()
      })
    })
  })
})
