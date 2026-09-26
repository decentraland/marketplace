import { ChainId, NFTCategory, Network, Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import stolenNftKeys from '../../../lib/stolenNfts.json'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'
import { renderWithProviders } from '../../../utils/test'
import SaleRentActionBox from './SaleRentActionBox'
import { Props } from './SaleRentActionBox.types'

jest.mock('../../../modules/trade/hooks', () => ({
  useCheckoutPriceInMana: () => ({ status: 'ready', manaWei: '1', isUSDPegged: false })
}))
jest.mock('../SaleActionBox/BuyNFTButtons/BuyWithCryptoButton', () => ({
  BuyWithCryptoButton: () => <div data-testid="buy-with-crypto-button" />
}))
jest.mock('../../BidButton', () => ({ __esModule: true, default: () => <div data-testid="bid-button" /> }))
jest.mock('../../ListingPrice', () => ({ ListingPrice: () => <div /> }))

const [stolenChainId, stolenContractAddress, stolenTokenId] = stolenNftKeys.find(key => key.startsWith('1:'))!.split(':')

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

  describe('when the nft was reported as stolen', () => {
    beforeEach(() => {
      props.nft = { ...nft, chainId: Number(stolenChainId), contractAddress: stolenContractAddress, tokenId: stolenTokenId } as NFT
    })

    it('should not render the buy and the bid buttons', () => {
      const { queryByTestId } = renderWithProviders(<SaleRentActionBox {...props} />)
      expect(queryByTestId('buy-with-crypto-button')).not.toBeInTheDocument()
      expect(queryByTestId('bid-button')).not.toBeInTheDocument()
    })
  })
})
