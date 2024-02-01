import { BigNumber } from 'ethers'
import { Context as ResponsiveContext } from 'react-responsive'
import { waitFor } from '@testing-library/react'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  BodyShape,
  ChainId,
  Item,
  ListingStatus,
  NFTCategory,
  Network,
  Rarity,
  WearableCategory
} from '@dcl/schemas'
import { renderWithProviders } from '../../../utils/test'
import {
  CrossChainProvider,
  Route,
  AxelarProvider
} from 'decentraland-transactions/crossChain'
import { getMinSaleValueInWei } from '../../BuyPage/utils'
import { VendorName } from '../../../modules/vendor'
import { marketplaceAPI } from '../../../modules/vendor/decentraland/marketplace/api'
import { NFT } from '../../../modules/nft/types'
import {
  BUY_NOW_BUTTON_TEST_ID,
  GET_MANA_BUTTON_TEST_ID,
  PAY_WITH_DATA_TEST_ID,
  TOKEN_SELECTOR_DATA_TEST_ID,
  BUY_WITH_CARD_TEST_ID,
  CHAIN_SELECTOR_DATA_TEST_ID,
  SWITCH_NETWORK_BUTTON_TEST_ID,
  FREE_TX_CONVERED_TEST_ID,
  BuyWithCryptoModal,
  PRICE_TOO_LOW_TEST_ID
} from './BuyWithCryptoModal'
import { Props } from './BuyWithCryptoModal.types'
import { DEFAULT_CHAINS, TESTNET_DEFAULT_CHAINS } from './utils'

const mockBalanceOf = jest.fn()
const mockWeb3ProviderGetBalance = jest.fn()
const mockConfigIs = jest.fn()

jest.mock('../../../modules/vendor/decentraland/marketplace/api')
jest.mock('decentraland-dapps/dist/lib/eth', () => {
  const actualEth = jest.requireActual('decentraland-dapps/dist/lib/eth')
  return {
    ...actualEth,
    getNetworkProvider: jest.fn()
  }
})
jest.mock('../../../config', () => {
  const actualConfig = jest.requireActual('../../../config')
  return {
    ...actualConfig,
    config: {
      ...actualConfig.config,
      is: () => mockConfigIs()
    }
  }
})
jest.mock('ethers', () => {
  const actualEthers = jest.requireActual('ethers')
  return {
    ...actualEthers,
    ethers: {
      ...actualEthers.ethers,
      providers: {
        ...actualEthers.ethers.providers,
        Web3Provider: function() {
          return { getBalance: mockWeb3ProviderGetBalance }
        }
      },
      Contract: function() {
        return {
          balanceOf: mockBalanceOf
        }
      }
    }
  }
})

jest.mock('decentraland-transactions/crossChain', () => {
  const original = jest.requireActual('decentraland-transactions/crossChain')
  return {
    ...original,
    CROSS_CHAIN_SUPPORTED_CHAINS: [137, 1],
    AxelarProvider: jest.fn()
  }
})

const MOCKED_ROUTE = {
  estimate: {
    actions: [
      {
        type: 'swap',
        chainType: 'evm',
        data: {
          chainId: '137',
          dex: 'Quickswap-v3',
          enabled: true,
          fee: 0.0497,
          liquidity: 79263097000000,
          poolId: '0x9CEff2F5138fC59eB925d270b8A7A9C02a1810f2',
          tokenAddresses: [
            '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
          ],
          path: [
            '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
          ],
          slippage: 0.03,
          custom: {
            poolFees: [438]
          },
          target: '0xf5b509bb0909a69b1c207e495f687a596c168e12'
        },
        fromChain: '137',
        toChain: '137',
        fromToken: {
          type: 'evm',
          chainId: '137',
          address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          name: 'Tether USD',
          symbol: 'USDT',
          decimals: 6,
          logoURI:
            'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdt.svg',
          coingeckoId: 'tether',
          usdPrice: 1
        },
        toToken: {
          type: 'evm',
          chainId: '137',
          address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          name: 'Wrapped Ether',
          symbol: 'WETH',
          decimals: 18,
          logoURI:
            'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/weth.svg',
          coingeckoId: 'weth',
          usdPrice: 1988.98
        },
        fromAmount: '416078',
        toAmount: '208986349923652',
        toAmountMin: '202716759425942',
        exchangeRate: '0.000502276856559712',
        priceImpact: '-0.01',
        stage: 3,
        provider: 'Quickswap-v3',
        description: 'Swap from USDT to WETH'
      },
      {
        type: 'swap',
        chainType: 'evm',
        data: {
          chainId: '137',
          dex: 'Sushiswap',
          enabled: true,
          fee: 0.3,
          liquidity: 7411681011700,
          poolId: '0xc48AE82ca34C63887b975F20ABA91a38f2a900B8',
          tokenAddresses: [
            '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
            '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4'
          ],
          path: [
            '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
            '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4'
          ],
          slippage: 0.05,
          target: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'
        },
        fromChain: '137',
        toChain: '137',
        fromToken: {
          type: 'evm',
          chainId: '137',
          address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          name: 'Wrapped Ether',
          symbol: 'WETH',
          decimals: 18,
          logoURI:
            'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/weth.svg',
          coingeckoId: 'weth',
          usdPrice: 1988.98
        },
        toToken: {
          type: 'evm',
          name: 'Decentraland',
          address: '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4',
          symbol: 'MANA',
          decimals: 18,
          chainId: '137',
          logoURI:
            'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png?1550108745',
          coingeckoId: 'decentraland',
          usdPrice: 0.409929
        },
        fromAmount: '208986349923652',
        toAmount: '1013982525014813433',
        toAmountMin: '963283398764072761',
        exchangeRate: '4851.907913532376149841',
        priceImpact: '0.00',
        stage: 3,
        provider: 'Sushiswap',
        description: 'Swap from WETH to MANA'
      }
    ],
    fromAmount: '416078',
    toAmount: '1013982525014813433',
    toAmountMin: '963283398764072761',
    sendAmount: '416078',
    exchangeRate: '2.437001055126234583',
    aggregatePriceImpact: '-0.01',
    estimatedRouteDuration: 0,
    aggregateSlippage: 8,
    fromToken: {
      type: 'evm',
      chainId: '137',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      logoURI:
        'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdt.svg',
      coingeckoId: 'tether'
    },
    toToken: {
      type: 'evm',
      name: 'Decentraland',
      address: '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4',
      symbol: 'MANA',
      decimals: 18,
      chainId: '137',
      logoURI:
        'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png?1550108745',
      coingeckoId: 'decentraland'
    },
    isBoostSupported: false,
    feeCosts: [],
    gasCosts: [
      {
        type: 'executeCall',
        token: {
          type: 'evm',
          chainId: '137',
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
          logoURI:
            'https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/polygon.svg',
          coingeckoId: 'matic-network',
          subGraphId: 'wmatic-wei',
          usdPrice: 0.786562
        },
        amount: '53600208345450000',
        gasLimit: '1612500',
        amountUsd: '0.042'
      }
    ]
  },
  transactionRequest: {
    routeType: 'EVM_ONLY',
    target: '0xce16F69375520ab01377ce7B88f5BA8C48F8D666',
    data: '',
    value: '0',
    gasLimit: '1612500',
    gasPrice: '31740439284',
    maxFeePerGas: '4980878568',
    maxPriorityFeePerGas: '1500000000'
  },
  params: {
    fromChain: '137',
    toChain: '137',
    fromToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    toToken: '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4',
    fromAmount: '416078',
    fromAddress: '0xbad79d832671d91b4bba85f600932faec0e5fd7c',
    toAddress: '0xbad79d832671d91b4bba85f600932faec0e5fd7c',
    slippageConfig: {
      autoMode: 1
    },
    enableBoost: true,
    postHook: {
      chainType: 'evm',
      fundAmount: '1',
      fundToken: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
      calls: [
        {
          chainType: 'evm',
          callType: 0,
          target: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
          value: '0',
          callData: '',
          payload: {
            tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            inputPos: 0
          },
          estimatedGas: '50000'
        },
        {
          chainType: 'evm',
          callType: 0,
          target: '0x214ffC0f0103735728dc66b61A22e4F163e275ae',
          value: '0',
          callData: '',
          payload: {
            tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            inputPos: 0
          },
          estimatedGas: '300000'
        },
        {
          chainType: 'evm',
          callType: 1,
          target: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
          value: '0',
          callData: '',
          payload: {
            tokenAddress: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
            inputPos: 1
          },
          estimatedGas: '50000'
        }
      ]
    },
    prefer: []
  }
}

const MOCKED_PROVIDER_TOKENS = [
  {
    type: 'evm',
    chainId: '1',
    address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
    name: 'Decentraland',
    symbol: 'MANA',
    decimals: 18,
    logoURI:
      'https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745',
    coingeckoId: 'decentraland',
    volatility: 3,
    usdPrice: 0.432695
  },
  {
    type: 'evm',
    name: 'Decentraland',
    address: '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4',
    symbol: 'MANA',
    decimals: 18,
    chainId: '137',
    logoURI:
      'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png?1550108745',
    coingeckoId: 'decentraland',
    volatility: 3,
    usdPrice: 0.43206
  },
  {
    type: 'evm',
    chainId: '137',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
    coingeckoId: 'usd-coin',
    volatility: 0,
    usdPrice: 1
  },
  {
    type: 'evm',
    chainId: '1',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
    coingeckoId: 'usd-coin',
    axelarNetworkSymbol: 'USDC',
    subGraphId: 'uusdc',
    volatility: 0,
    usdPrice: 1
  }
]

const MOCK_SUPPORTED_CHAIN = [...TESTNET_DEFAULT_CHAINS, ...DEFAULT_CHAINS]

const MOCKED_ITEM = {
  id: '0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562-0',
  beneficiary: '0x6240b908f4880da265c2e55d5ca644b50a4cb0d4',
  itemId: '0',
  name: 'Rare Pepe Shirt Male',
  thumbnail:
    'https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562:0/thumbnail',
  url: '/contracts/0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562/items/0',
  category: NFTCategory.WEARABLE,
  contractAddress: '0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562',
  rarity: Rarity.COMMON,
  available: 98,
  isOnSale: false,
  creator: '0x6240b908f4880da265c2e55d5ca644b50a4cb0d4',
  data: {
    wearable: {
      description: '',
      category: WearableCategory.BODY_SHAPE,
      bodyShapes: [BodyShape.FEMALE],
      rarity: Rarity.LEGENDARY,
      isSmart: false
    }
  },
  network: Network.MATIC,
  chainId: ChainId.MATIC_MAINNET,
  price: '22000000000000000000',
  createdAt: 1660274029,
  updatedAt: 1660677796,
  reviewedAt: 1660677842,
  firstListedAt: 0,
  soldAt: 0,
  maxListingPrice: null,
  minListingPrice: null,
  listings: 0,
  owners: null,
  urn:
    'urn:decentraland:matic:collections-v2:0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562:0',
  picks: {
    count: 0
  }
}

const MOCKED_NFT = {
  id:
    '0x9412dcbecc58a924e9c93c42ca9d0430d5d6c4c6-105312291668557186697918027683670432318895095400549111254310977565',
  tokenId: '105312291668557186697918027683670432318895095400549111254310977565',
  contractAddress: '0x9412dcbecc58a924e9c93c42ca9d0430d5d6c4c6',
  category: NFTCategory.WEARABLE,
  activeOrderId:
    '0x306a7497acdd4f8feabc692610fb0f0fc60926e8f042648a8cd84e990f159a8b',
  openRentalId: null,
  owner: '0xbb41547794847cea1966b12dd615db2094309a39',
  name: 'PEDIGREE® FOSTERVERSE™ MUTTPACK',
  image:
    'https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x9412dcbecc58a924e9c93c42ca9d0430d5d6c4c6:1/thumbnail',
  url:
    '/contracts/0x9412dcbecc58a924e9c93c42ca9d0430d5d6c4c6/tokens/105312291668557186697918027683670432318895095400549111254310977565',
  data: {
    wearable: {
      bodyShapes: [BodyShape.MALE, BodyShape.FEMALE],
      category: WearableCategory.UPPER_BODY,
      description: '',
      rarity: Rarity.UNCOMMON,
      isSmart: false
    }
  },
  issuedId: '29',
  itemId: '1',
  network: Network.MATIC,
  chainId: ChainId.MATIC_MAINNET,
  createdAt: 1674598717000,
  updatedAt: 1699962957000,
  soldAt: 0,
  urn:
    'urn:decentraland:matic:collections-v2:0x9412dcbecc58a924e9c93c42ca9d0430d5d6c4c6:1',
  vendor: VendorName.DECENTRALAND
}

const MOCKED_ORDER = {
  id: '0x306a7497acdd4f8feabc692610fb0f0fc60926e8f042648a8cd84e990f159a8b',
  marketplaceAddress: '0x480a0f4e360e8964e68858dd231c2922f1df45ef',
  contractAddress: '0x9412dcbecc58a924e9c93c42ca9d0430d5d6c4c6',
  tokenId: '105312291668557186697918027683670432318895095400549111254310977565',
  owner: '0xbb41547794847cea1966b12dd615db2094309a39',
  buyer: null,
  price: '10000000000000000',
  status: ListingStatus.OPEN,
  network: Network.MATIC,
  chainId: ChainId.MATIC_MAINNET,
  expiresAt: 1738422000,
  createdAt: 1699962957000,
  updatedAt: 1699962957000,
  issuedId: '29'
}

async function renderBuyWithCryptoModal(props: Partial<Props> = {}) {
  const defaultProps: Props = {
    metadata: { asset: MOCKED_ITEM },
    isLoading: false,
    isBuyWithCardPage: false,
    isLoadingAuthorization: false,
    isLoadingBuyCrossChain: false,
    isSwitchingNetwork: false,
    wallet: null,
    name: 'BuyModal',
    onClose: jest.fn(),
    getContract: jest.fn(),
    onAuthorizedAction: jest.fn(),
    onBuyItem: jest.fn(),
    onBuyItemThroughProvider: jest.fn(),
    onBuyItemWithCard: jest.fn(),
    onCloseAuthorization: jest.fn(),
    onExecuteOrder: jest.fn(),
    onExecuteOrderWithCard: jest.fn(),
    onGetMana: jest.fn(),
    onSwitchNetwork: jest.fn()
  }
  const rendered = renderWithProviders(
    <ResponsiveContext.Provider value={{ width: 900 }}>
      <BuyWithCryptoModal {...defaultProps} {...props} />
    </ResponsiveContext.Provider>
  )

  await waitFor(() => expect(rendered.findByTestId(PAY_WITH_DATA_TEST_ID)))

  return rendered
}

describe('BuyWithCryptoModal', () => {
  let modalProps: Partial<Props>
  let crossChainProvider: CrossChainProvider
  beforeEach(() => {
    crossChainProvider = ({
      init: jest.fn(),
      initialized: true,
      isLibInitialized: () => true,
      getFromAmount: jest.fn(),
      getMintNFTRoute: jest.fn(),
      getBuyNFTRoute: jest.fn(),
      getSupportedChains: () => MOCK_SUPPORTED_CHAIN,
      getSupportedTokens: () => MOCKED_PROVIDER_TOKENS
    } as unknown) as AxelarProvider
    ;(AxelarProvider as jest.Mock).mockImplementation(() => crossChainProvider)
    ;(mockConfigIs as jest.Mock).mockReturnValue(false) // so it returns prod  values
    marketplaceAPI.fetchWalletTokenBalances = jest.fn().mockResolvedValue([])
    modalProps = {
      onBuyItem: jest.fn(),
      onExecuteOrder: jest.fn(),
      metadata: { asset: MOCKED_ITEM },
      getContract: jest.fn().mockResolvedValue({
        address: '0x0' // collection store mock
      }),
      wallet: {
        networks: {
          [Network.ETHEREUM]: {
            mana: 0
          },
          [Network.MATIC]: {
            mana: 0
          }
        }
      } as Wallet
    }
    mockWeb3ProviderGetBalance.mockResolvedValue(
      BigNumber.from('1000000000000000000')
    ) //  this if for the check if can pay gas
  })

  describe('and the user is connected to Ethereum network', () => {
    beforeEach(() => {
      modalProps.wallet = {
        ...modalProps.wallet,
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    describe('and tries to buy an Ethereum wearable', () => {
      beforeEach(() => {
        modalProps.metadata = {
          asset: {
            ...MOCKED_ITEM,
            network: Network.ETHEREUM,
            chainId: ChainId.ETHEREUM_MAINNET
          }
        }
      })

      describe('and wants to pay with MANA', () => {
        describe('and has enough MANA balance in Ethereum to buy the Item', () => {
          beforeEach(() => {
            modalProps.metadata = {
              asset: {
                ...(modalProps.metadata ? modalProps.metadata.asset : {}),
                price: '10000000000000000'
              } as Item
            }
            modalProps.wallet = {
              ...modalProps.wallet,
              networks: {
                [Network.ETHEREUM]: {
                  mana: 1000000000000000000 // 1 MANA
                },
                [Network.MATIC]: {
                  mana: 0 // 0 MANA on MATIC
                }
              }
            } as Wallet
            modalProps.onAuthorizedAction = jest
              .fn()
              .mockImplementation(({ onAuthorized }: any) => {
                onAuthorized()
              })
          })

          describe('and its trying to mint an item', () => {
            beforeEach(() => {
              modalProps.metadata = {
                asset: {
                  ...MOCKED_ITEM,
                  ...(modalProps.metadata ? modalProps.metadata.asset : {})
                }
              }
            })
            it('should render the buy now button and call the onBuyItem on the click', async () => {
              const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
              const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)
              expect(buyNowButton).toBeInTheDocument()

              buyNowButton.click()
              expect(modalProps.onBuyItem).toHaveBeenCalledWith(
                modalProps.metadata?.asset
              )
            })
          })

          describe('and its trying to buy an existing NFT', () => {
            beforeEach(() => {
              modalProps.metadata = {
                asset: {
                  ...MOCKED_NFT,
                  ...(modalProps.metadata ? modalProps.metadata.asset : {})
                } as NFT,
                order: { ...MOCKED_ORDER, price: '10000000000000000' }
              }
            })
            it('should render the buy now button and call the onExecuteOrder on the click', async () => {
              const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
              const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)
              expect(buyNowButton).toBeInTheDocument()

              buyNowButton.click()
              expect(modalProps.onExecuteOrder).toHaveBeenCalledWith(
                MOCKED_ORDER,
                modalProps.metadata?.asset,
                undefined,
                true
              )
            })
          })
        })

        describe('and does not have enough MANA balance in Ethereum to buy the Item', () => {
          beforeEach(() => {
            ;(modalProps.metadata?.asset as Item).price = '10000000000000000' // 0.1 MANA
            modalProps.wallet = {
              ...modalProps.wallet,
              networks: {
                [Network.ETHEREUM]: {
                  mana: 0.001
                },
                [Network.MATIC]: {
                  mana: 0
                }
              }
            } as Wallet
          })

          it('should render the get MANA and buy with card buttons', async () => {
            const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
            expect(getByTestId(GET_MANA_BUTTON_TEST_ID)).toBeInTheDocument()
            expect(getByTestId(BUY_WITH_CARD_TEST_ID)).toBeInTheDocument()
          })
        })
      })

      describe('and tries to pay with another Ethereum token', () => {
        let route: Route
        beforeEach(() => {
          route = ({
            route: MOCKED_ROUTE
          } as unknown) as Route
          ;(crossChainProvider.getMintNFTRoute as jest.Mock).mockResolvedValue(
            route
          )
          ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
            '0.438482'
          ) // 0.43 USDC needed to buy the item
          modalProps.onBuyItemThroughProvider = jest.fn()
          mockBalanceOf.mockResolvedValue(BigNumber.from('2000000')) // user has 2 USDC in wei
        })
        describe('and has enough balance to buy it', () => {
          beforeEach(() => {
            modalProps.onBuyItemThroughProvider = jest.fn()
          })
          it('should render the buy now button and call the onBuyItemThroughProvider on the click', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            const buyNowButton = await findByTestId(BUY_NOW_BUTTON_TEST_ID)
            expect(buyNowButton).toBeInTheDocument()
            buyNowButton.click()

            await waitFor(() =>
              expect(modalProps.onBuyItemThroughProvider).toHaveBeenCalledWith(
                route
              )
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('200000')) // user has 0.2 USDC in wei
          })
          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(GET_MANA_BUTTON_TEST_ID)
            ).toBeInTheDocument()
            expect(
              await findByTestId(BUY_WITH_CARD_TEST_ID)
            ).toBeInTheDocument()
          })
        })
      })

      describe('and tries to pay with another chain token', () => {
        let route: Route
        beforeEach(() => {
          route = ({
            route: MOCKED_ROUTE
          } as unknown) as Route
          ;(crossChainProvider.getMintNFTRoute as jest.Mock).mockResolvedValue(
            route
          )
        })

        describe('and has enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('2000000')) // user has 2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the switch network button to send the tx', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            chainSelector.click()

            const polygonNetworkOption = await findByText('Polygon')
            polygonNetworkOption.click()

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(SWITCH_NETWORK_BUTTON_TEST_ID)
            ).toBeInTheDocument()
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('200000')) // user has 0.2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the get MANA and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            chainSelector.click()

            const polygonNetworkOption = await findByText(/Polygon/)
            polygonNetworkOption.click()

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(GET_MANA_BUTTON_TEST_ID)
            ).toBeInTheDocument()
            expect(
              await findByTestId(BUY_WITH_CARD_TEST_ID)
            ).toBeInTheDocument()
          })
        })
      })
    })

    describe('and tries to buy a Polygon wearable', () => {
      beforeEach(() => {
        modalProps.metadata = {
          asset: {
            ...MOCKED_ITEM,
            network: Network.MATIC,
            chainId: ChainId.MATIC_MAINNET
          }
        }
      })

      describe('and wants to pay with MANA', () => {
        describe('and it is an item suitable for a meta tx', () => {
          beforeEach(() => {
            ;(modalProps.metadata?.asset as Item).price = BigNumber.from(
              getMinSaleValueInWei()
            )
              .add(1)
              .toString()
          })

          describe('and has enough balance to buy it with MANA', () => {
            beforeEach(() => {
              modalProps.wallet = {
                ...modalProps.wallet,
                networks: {
                  [Network.MATIC]: {
                    mana: 1 // 1 MANA
                  }
                }
              } as Wallet
              modalProps.getContract = jest.fn().mockResolvedValue({
                address: '0x0'
              })
              modalProps.onAuthorizedAction = jest
                .fn()
                .mockImplementation(({ onAuthorized }: any) => {
                  onAuthorized()
                })
            })

            describe('and its trying to mint an item', () => {
              beforeEach(() => {
                modalProps.metadata = {
                  asset: {
                    ...MOCKED_ITEM,
                    ...(modalProps.metadata ? modalProps.metadata.asset : {})
                  }
                }
              })

              it('should render the buy now button and free transaction label and call on onBuyItem on the click', async () => {
                const { getByTestId } = await renderBuyWithCryptoModal(
                  modalProps
                )
                const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)

                expect(buyNowButton).toBeInTheDocument()
                expect(
                  getByTestId(FREE_TX_CONVERED_TEST_ID)
                ).toBeInTheDocument()

                buyNowButton.click()

                await waitFor(() =>
                  expect(modalProps.onBuyItem).toHaveBeenCalledWith(
                    modalProps.metadata?.asset
                  )
                )
              })
            })

            describe('and its trying to buy an existing NFT', () => {
              beforeEach(() => {
                modalProps.metadata = {
                  asset: {
                    ...MOCKED_NFT,
                    ...(modalProps.metadata ? modalProps.metadata.asset : {})
                  } as NFT,
                  order: {
                    ...MOCKED_ORDER,
                    price: BigNumber.from(getMinSaleValueInWei())
                      .add(1)
                      .toString()
                  }
                }
              })

              it('should render the buy now button and free transaction label and call on onExecuteOrder on the click', async () => {
                const { getByTestId } = await renderBuyWithCryptoModal(
                  modalProps
                )
                const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)

                expect(buyNowButton).toBeInTheDocument()
                expect(
                  getByTestId(FREE_TX_CONVERED_TEST_ID)
                ).toBeInTheDocument()

                buyNowButton.click()

                await waitFor(() =>
                  expect(modalProps.onExecuteOrder).toHaveBeenCalledWith(
                    modalProps.metadata?.order,
                    modalProps.metadata?.asset,
                    undefined,
                    true
                  )
                )
              })
            })
          })

          describe('and does not have enough balance to buy it with MANA', () => {
            beforeEach(() => {
              modalProps.wallet = {
                ...modalProps.wallet,
                networks: {
                  [Network.ETHEREUM]: {
                    mana: 0 // 0 MATIC on Ethereum
                  },
                  [Network.MATIC]: {
                    mana: 0 // 1 MANA
                  }
                }
              } as Wallet
            })

            it('should render the get mana and buy with card buttons', async () => {
              const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
              expect(getByTestId(GET_MANA_BUTTON_TEST_ID)).toBeInTheDocument()
              expect(getByTestId(BUY_WITH_CARD_TEST_ID)).toBeInTheDocument()
            })
          })
        })

        describe('and it is an item not suitable for a meta tx', () => {
          beforeEach(() => {
            ;(modalProps.metadata?.asset as Item).price = BigNumber.from(
              getMinSaleValueInWei()
            )
              .sub(1)
              .toString()
          })

          describe('and has enough balance to buy it with MANA', () => {
            beforeEach(() => {
              modalProps.wallet = {
                ...modalProps.wallet,
                networks: {
                  [Network.MATIC]: {
                    mana: 1000000000000000000 // 1 MANA
                  }
                }
              } as Wallet
              modalProps.onSwitchNetwork = jest.fn()
            })

            it('should render the switch network button and label saying it not free due to the low price and call on onSwitchNetwork on the click', async () => {
              const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
              const switchNetworkButton = getByTestId(
                SWITCH_NETWORK_BUTTON_TEST_ID
              )

              expect(switchNetworkButton).toBeInTheDocument()
              expect(getByTestId(PRICE_TOO_LOW_TEST_ID)).toBeInTheDocument()

              switchNetworkButton.click()

              await waitFor(() =>
                expect(modalProps.onSwitchNetwork).toHaveBeenCalled()
              )
            })
          })

          describe('and does not have enough balance to buy it with MANA', () => {
            beforeEach(() => {
              modalProps.wallet = {
                ...modalProps.wallet,
                networks: {
                  [Network.MATIC]: {
                    mana: 0 // 1 MANA
                  }
                }
              } as Wallet
            })

            it('should render the get mana and buy with card buttons', async () => {
              const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
              expect(getByTestId(GET_MANA_BUTTON_TEST_ID)).toBeInTheDocument()
              expect(getByTestId(BUY_WITH_CARD_TEST_ID)).toBeInTheDocument()
            })
          })
        })
      })

      describe('and wants to pay with another Ethereum token', () => {
        let route: Route
        beforeEach(() => {
          route = ({
            route: MOCKED_ROUTE
          } as unknown) as Route
          ;(crossChainProvider.getMintNFTRoute as jest.Mock).mockResolvedValue(
            route
          )
          modalProps.onBuyItemThroughProvider = jest.fn()
        })

        describe('and has enough token balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('2000000')) // user has 2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })

          it('should render buy now button and call the onBuyItemThroughProvider', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            chainSelector.click()

            const ethereumNetworkOption = await findByText('Ethereum')
            ethereumNetworkOption.click()

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            const buyNowButton = await findByTestId(BUY_NOW_BUTTON_TEST_ID)

            expect(buyNowButton).toBeInTheDocument()
            buyNowButton.click()

            await waitFor(() =>
              expect(modalProps.onBuyItemThroughProvider).toHaveBeenCalledWith(
                route
              )
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('200000')) // user has 0.2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            chainSelector.click()

            const ethereumNetworkOption = await findByText('Ethereum')
            ethereumNetworkOption.click()

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(GET_MANA_BUTTON_TEST_ID)
            ).toBeInTheDocument()

            expect(
              await findByTestId(BUY_WITH_CARD_TEST_ID)
            ).toBeInTheDocument()
          })
        })
      })

      describe('and wants to pay with another Polygon token', () => {
        let route: Route
        beforeEach(() => {
          route = ({
            route: MOCKED_ROUTE
          } as unknown) as Route
          ;(crossChainProvider.getMintNFTRoute as jest.Mock).mockResolvedValue(
            route
          )
        })

        describe('and has enough token balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('2000000')) // user has 2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
            modalProps.onSwitchNetwork = jest.fn()
          })

          it('should render the switch network button and call the onSwitchNetwork fn on click', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            const switchNetworkButton = await findByTestId(
              SWITCH_NETWORK_BUTTON_TEST_ID
            )

            expect(switchNetworkButton).toBeInTheDocument()

            switchNetworkButton.click()

            await waitFor(() =>
              expect(modalProps.onSwitchNetwork).toHaveBeenCalled()
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('200000')) // user has 0.2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            chainSelector.click()

            const ethereumNetworkOption = await findByText('Ethereum')
            ethereumNetworkOption.click()

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(GET_MANA_BUTTON_TEST_ID)
            ).toBeInTheDocument()

            expect(
              await findByTestId(BUY_WITH_CARD_TEST_ID)
            ).toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('and the user is connected to Polygon network', () => {
    beforeEach(() => {
      modalProps.wallet = {
        ...modalProps.wallet,
        chainId: ChainId.MATIC_MAINNET,
        network: Network.MATIC
      } as Wallet
    })

    describe('and tries to buy an Ethereum wearable', () => {
      beforeEach(() => {
        ;(modalProps.metadata?.asset as Item).network = Network.ETHEREUM
        ;(modalProps.metadata?.asset as Item).chainId = ChainId.ETHEREUM_MAINNET
      })

      describe('and wants to pay with MANA', () => {
        describe('and has enough MANA balance in Ethereum to buy the Item', () => {
          beforeEach(() => {
            ;(modalProps.metadata?.asset as Item).price = '10000000000000000' // 0.1 MANA
            modalProps.wallet = {
              ...modalProps.wallet,
              networks: {
                [Network.ETHEREUM]: {
                  mana: 1000000000000000000 // 1 MANA
                }
              }
            } as Wallet
            modalProps.onSwitchNetwork = jest.fn()
          })

          it('should render the switch network button and call the onSwitchNetwork callback on the click', async () => {
            const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
            const switchNetworkButton = getByTestId(
              SWITCH_NETWORK_BUTTON_TEST_ID
            )
            expect(switchNetworkButton).toBeInTheDocument()

            switchNetworkButton.click()
            expect(modalProps.onSwitchNetwork).toHaveBeenCalledWith(
              ChainId.ETHEREUM_MAINNET
            )
          })
        })

        describe('and does not have enough MANA balance in Ethereum to buy the Item', () => {
          beforeEach(() => {
            ;(modalProps.metadata?.asset as Item).price = '10000000000000000' // 0.1 MANA
            modalProps.wallet = {
              ...modalProps.wallet,
              networks: {
                [Network.ETHEREUM]: {
                  mana: 0.001
                }
              }
            } as Wallet
          })

          it('should render the get MANA and buy with card buttons', async () => {
            const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
            expect(getByTestId(GET_MANA_BUTTON_TEST_ID)).toBeInTheDocument()
            expect(getByTestId(BUY_WITH_CARD_TEST_ID)).toBeInTheDocument()
          })
        })
      })

      describe('and tries to pay with another Ethereum token', () => {
        let route: Route
        beforeEach(() => {
          route = ({
            route: MOCKED_ROUTE
          } as unknown) as Route
          ;(crossChainProvider.getMintNFTRoute as jest.Mock).mockResolvedValue(
            route
          )
          modalProps.onSwitchNetwork = jest.fn()
        })
        describe('and has enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('2000000')) // user has 2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
            modalProps.onBuyItemThroughProvider = jest.fn()
          })
          it('should render the switch network button and call the onSwitchNetwork on the click', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            const switchNetworkButton = await findByTestId(
              SWITCH_NETWORK_BUTTON_TEST_ID
            )

            expect(switchNetworkButton).toBeInTheDocument()

            switchNetworkButton.click()

            await waitFor(() =>
              expect(modalProps.onSwitchNetwork).toHaveBeenCalledWith(
                ChainId.ETHEREUM_MAINNET
              )
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('200000')) // user has 0.2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(GET_MANA_BUTTON_TEST_ID)
            ).toBeInTheDocument()
            expect(
              await findByTestId(BUY_WITH_CARD_TEST_ID)
            ).toBeInTheDocument()
          })
        })
      })

      describe('and tries to pay with another chain token', () => {
        let route: Route
        beforeEach(() => {
          route = ({
            route: MOCKED_ROUTE
          } as unknown) as Route
          ;(crossChainProvider.getMintNFTRoute as jest.Mock).mockResolvedValue(
            route
          )
        })

        describe('and has enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('2000000')) // user has 2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the switch network button to send the tx', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(SWITCH_NETWORK_BUTTON_TEST_ID)
            ).toBeInTheDocument()
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('200000')) // user has 0.2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the get MANA and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(GET_MANA_BUTTON_TEST_ID)
            ).toBeInTheDocument()
            expect(
              await findByTestId(BUY_WITH_CARD_TEST_ID)
            ).toBeInTheDocument()
          })
        })
      })
    })

    describe('and tries to buy a Polygon wearable', () => {
      beforeEach(() => {
        ;(modalProps.metadata?.asset as Item).network = Network.MATIC
        ;(modalProps.metadata?.asset as Item).chainId = ChainId.MATIC_MAINNET
      })

      describe('and wants to pay with MANA', () => {
        describe('and has enough balance to buy it with MANA', () => {
          beforeEach(() => {
            modalProps.wallet = {
              ...modalProps.wallet,
              networks: {
                [Network.MATIC]: {
                  mana: 1000000000000000000 // 1 MANA
                }
              }
            } as Wallet
            modalProps.getContract = jest.fn().mockResolvedValue({
              address: '0x0'
            })
            modalProps.onAuthorizedAction = jest
              .fn()
              .mockImplementation(({ onAuthorized }: any) => {
                onAuthorized()
              })
          })

          describe('and its trying to mint an item', () => {
            beforeEach(() => {
              modalProps.metadata = {
                asset: {
                  ...MOCKED_ITEM,
                  ...(modalProps.metadata ? modalProps.metadata.asset : {})
                }
              }
            })

            it('should render the buy now button and call on onBuyItem on the click', async () => {
              const {
                queryByTestId,
                getByTestId
              } = await renderBuyWithCryptoModal(modalProps)
              const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)

              expect(buyNowButton).toBeInTheDocument()
              expect(
                queryByTestId(FREE_TX_CONVERED_TEST_ID)
              ).not.toBeInTheDocument() // do not show the free tx covered label

              buyNowButton.click()

              await waitFor(() =>
                expect(modalProps.onBuyItem).toHaveBeenCalledWith(
                  modalProps.metadata?.asset
                )
              )
            })
          })

          describe('and its trying to buy an existing NFT', () => {
            beforeEach(() => {
              modalProps.metadata = {
                asset: {
                  ...MOCKED_NFT,
                  ...(modalProps.metadata ? modalProps.metadata.asset : {})
                } as NFT,
                order: { ...MOCKED_ORDER, price: '10000000000000000' }
              }
            })

            it('should render the buy now button and call on onBuyItem on the click', async () => {
              const {
                queryByTestId,
                getByTestId
              } = await renderBuyWithCryptoModal(modalProps)
              const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)

              expect(buyNowButton).toBeInTheDocument()
              expect(
                queryByTestId(FREE_TX_CONVERED_TEST_ID)
              ).not.toBeInTheDocument() // do not show the free tx covered label

              buyNowButton.click()

              await waitFor(() =>
                expect(modalProps.onExecuteOrder).toHaveBeenCalledWith(
                  modalProps.metadata?.order,
                  modalProps.metadata?.asset,
                  undefined,
                  true
                )
              )
            })
          })
        })

        describe('and does not have enough balance to buy it with MANA', () => {
          beforeEach(() => {
            modalProps.wallet = {
              ...modalProps.wallet,
              networks: {
                [Network.ETHEREUM]: {
                  mana: 0 // 0 MATIC on Ethereum
                },
                [Network.MATIC]: {
                  mana: 0 // 1 MANA
                }
              }
            } as Wallet
          })

          it('should render the get mana and buy with card buttons', async () => {
            const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
            expect(getByTestId(GET_MANA_BUTTON_TEST_ID)).toBeInTheDocument()
            expect(getByTestId(BUY_WITH_CARD_TEST_ID)).toBeInTheDocument()
          })
        })
      })

      describe('and wants to pay with another Ethereum token', () => {
        let route: Route
        beforeEach(() => {
          route = ({
            route: MOCKED_ROUTE
          } as unknown) as Route
          ;(crossChainProvider.getMintNFTRoute as jest.Mock).mockResolvedValue(
            route
          )
          modalProps.onSwitchNetwork = jest.fn()
        })

        describe('and has enough token balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('2000000')) // user has 2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })

          it('should render switch network button and call the onSwitchNetwork', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            chainSelector.click()

            const ethereumNetworkOption = await findByText('Ethereum')
            ethereumNetworkOption.click()

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            const switchNetworkButton = await findByTestId(
              SWITCH_NETWORK_BUTTON_TEST_ID
            )

            expect(switchNetworkButton).toBeInTheDocument()
            switchNetworkButton.click()

            await waitFor(() =>
              expect(modalProps.onSwitchNetwork).toHaveBeenCalledWith(
                ChainId.ETHEREUM_MAINNET
              )
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('200000')) // user has 0.2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            chainSelector.click()

            const ethereumNetworkOption = await findByText('Ethereum')
            ethereumNetworkOption.click()

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(GET_MANA_BUTTON_TEST_ID)
            ).toBeInTheDocument()

            expect(
              await findByTestId(BUY_WITH_CARD_TEST_ID)
            ).toBeInTheDocument()
          })
        })
      })

      describe('and wants to pay with another Polygon token', () => {
        let route: Route
        beforeEach(() => {
          route = ({
            route: MOCKED_ROUTE
          } as unknown) as Route
          ;(crossChainProvider.getMintNFTRoute as jest.Mock).mockResolvedValue(
            route
          )
        })

        describe('and has enough token balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('2000000')) // user has 2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
            modalProps.onBuyItemThroughProvider = jest.fn()
          })

          it('should render the buy now button and call the onBuyItemThroughProvider fn on click', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            const buyNowButton = await findByTestId(BUY_NOW_BUTTON_TEST_ID)

            expect(buyNowButton).toBeInTheDocument()
            buyNowButton.click()

            await waitFor(() =>
              expect(modalProps.onBuyItemThroughProvider).toHaveBeenCalledWith(
                route
              )
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockBalanceOf.mockResolvedValueOnce(BigNumber.from('200000')) // user has 0.2 USDC in wei
            ;(crossChainProvider.getFromAmount as jest.Mock).mockResolvedValue(
              '0.438482'
            ) // 0.43 USDC needed to buy the item
          })
          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            chainSelector.click()

            const ethereumNetworkOption = await findByText('Ethereum')
            ethereumNetworkOption.click()

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            tokenSelector.click()

            const usdcTokenOption = await findByText('USDC')
            usdcTokenOption.click()

            expect(
              await findByTestId(GET_MANA_BUTTON_TEST_ID)
            ).toBeInTheDocument()

            expect(
              await findByTestId(BUY_WITH_CARD_TEST_ID)
            ).toBeInTheDocument()
          })
        })
      })
    })
  })
})
