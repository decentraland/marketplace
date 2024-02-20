import { BigNumber } from 'ethers'
import { Context as ResponsiveContext } from 'react-responsive'
import { fireEvent, waitFor } from '@testing-library/react'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  BodyShape,
  ChainId,
  Item,
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
import { marketplaceAPI } from '../../../modules/vendor/decentraland/marketplace/api'
import {
  BUY_NOW_BUTTON_TEST_ID,
  GET_MANA_BUTTON_TEST_ID,
  BUY_WITH_CARD_TEST_ID,
  SWITCH_NETWORK_BUTTON_TEST_ID,
  BuyWithCryptoModal,
  PRICE_TOO_LOW_TEST_ID
} from './BuyWithCryptoModal'
import {
  OnGetCrossChainRoute,
  OnGetGasCost,
  Props
} from './BuyWithCryptoModal.types'
import { DEFAULT_CHAINS, TESTNET_DEFAULT_CHAINS } from './utils'
import {
  CHAIN_SELECTOR_DATA_TEST_ID,
  PAY_WITH_DATA_TEST_ID,
  TOKEN_SELECTOR_DATA_TEST_ID
} from './PaymentSelector'
import { useTokenBalance } from './hooks'
import { FREE_TX_COVERED_TEST_ID } from './PurchaseTotal'
import { Asset } from '../../../modules/asset/types'

const mockConfigIs = jest.fn()

const mockUseTokenBalance = (
  isFetchingBalance: boolean,
  tokenBalance: BigNumber
) => {
  const useTokenBalanceMock = useTokenBalance as jest.Mock<
    ReturnType<typeof useTokenBalance>,
    Parameters<typeof useTokenBalance>
  >
  useTokenBalanceMock.mockReset()
  useTokenBalanceMock.mockReturnValue({
    isFetchingBalance,
    tokenBalance
  })
}

jest.mock('../../../modules/vendor/decentraland/marketplace/api')
jest.mock('./hooks', () => {
  const module = jest.requireActual('./hooks')
  return {
    ...module,
    useTokenBalance: jest.fn().mockReturnValue({
      isFetchingBalance: false,
      tokenBalance: BigNumber.from(10000000000000)
    })
  }
})
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

const MOCKED_ITEM: Asset = {
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

async function renderBuyWithCryptoModal(props: Partial<Props> = {}) {
  const defaultProps: Props = {
    name: 'A name',
    metadata: { asset: MOCKED_ITEM },
    price: (MOCKED_ITEM as Item).price,
    wallet: null,
    isLoading: false,
    isLoadingBuyCrossChain: false,
    isLoadingAuthorization: false,
    isSwitchingNetwork: false,
    isBuyWithCardPage: false,
    onGetCrossChainRoute: jest
      .fn<ReturnType<OnGetCrossChainRoute>, Parameters<OnGetCrossChainRoute>>()
      .mockReturnValue({
        route: undefined,
        fromAmount: undefined,
        routeFeeCost: undefined,
        routeTotalUSDCost: undefined,
        isFetchingRoute: false,
        routeFailed: false
      }),
    onGetGasCost: jest
      .fn<ReturnType<OnGetGasCost>, Parameters<OnGetGasCost>>()
      .mockReturnValue({ gasCost: undefined, isFetchingGasCost: false }),
    onSwitchNetwork: jest.fn(),
    onBuyNatively: jest.fn(),
    onBuyWithCard: jest.fn(),
    onBuyCrossChain: jest.fn(),
    onGetMana: jest.fn(),
    onClose: jest.fn()
  }
  const rendered = renderWithProviders(
    <ResponsiveContext.Provider value={{ width: 900 }}>
      <BuyWithCryptoModal {...defaultProps} {...props} />
    </ResponsiveContext.Provider>
  )

  await waitFor(() => expect(rendered.findByTestId(PAY_WITH_DATA_TEST_ID)))

  return rendered
}

const createOnGetCrossChainRouteMockForUSDC = (
  route: Route,
  chainId: ChainId,
  fromAmount: string
) => {
  return jest
    .fn<ReturnType<OnGetCrossChainRoute>, Parameters<OnGetCrossChainRoute>>()
    .mockReturnValue({
      route,
      fromAmount,
      routeFeeCost: {
        token: {
          type: 'evm' as any,
          chainId: chainId.toString(),
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
        gasCostWei: BigNumber.from(0),
        gasCost: '0',
        feeCost: '0',
        feeCostWei: BigNumber.from(0),
        totalCost: '0'
      },
      routeTotalUSDCost: 1000,
      isFetchingRoute: false,
      routeFailed: false
    })
}

describe('BuyWithCryptoModal', () => {
  let modalProps: Partial<Props>
  let crossChainProvider: CrossChainProvider
  beforeEach(() => {
    crossChainProvider = ({
      init: jest.fn(),
      initialized: true,
      isLibInitialized: () => true,
      getSupportedChains: () => MOCK_SUPPORTED_CHAIN,
      getSupportedTokens: () => MOCKED_PROVIDER_TOKENS
    } as unknown) as AxelarProvider
    ;(AxelarProvider as jest.Mock).mockImplementation(() => crossChainProvider)
    ;(mockConfigIs as jest.Mock).mockReturnValue(false) // so it returns prod  values
    marketplaceAPI.fetchWalletTokenBalances = jest.fn().mockResolvedValue([])
    modalProps = {
      onBuyNatively: jest.fn(),
      onBuyCrossChain: jest.fn(),
      metadata: { asset: MOCKED_ITEM },
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
  })

  describe('and the user is connected to Ethereum network', () => {
    beforeEach(() => {
      modalProps.wallet = {
        ...modalProps.wallet,
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    describe('and tries to buy an Ethereum asset', () => {
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
        describe('and has enough MANA balance in Ethereum to buy an asset', () => {
          beforeEach(() => {
            modalProps.metadata = {
              asset: {
                ...MOCKED_ITEM,
                ...(modalProps.metadata ? modalProps.metadata.asset : {}),
                price: '10000000000000000'
              } as Item
            }
            modalProps.price = '10000000000000000'
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
          })

          it('should render the buy now button and call the onBuyNatively on click', async () => {
            const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
            const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)
            expect(buyNowButton).toBeInTheDocument()

            fireEvent.click(buyNowButton)
            expect(modalProps.onBuyNatively).toHaveBeenCalled()
          })
        })

        describe('and does not have enough MANA balance in Ethereum to buy the asset', () => {
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
          modalProps.onGetCrossChainRoute = createOnGetCrossChainRouteMockForUSDC(
            route,
            ChainId.ETHEREUM_MAINNET,
            '0.438482'
          )
        })

        describe('and has enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('2000000')) // user has 2 USDC in wei
          })

          it('should render the buy now button and call the onBuyCrossChain on the click', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

            const buyNowButton = await findByTestId(BUY_NOW_BUTTON_TEST_ID)
            expect(buyNowButton).toBeInTheDocument()
            fireEvent.click(buyNowButton)

            await waitFor(() =>
              expect(modalProps.onBuyCrossChain).toHaveBeenCalledWith(route)
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('200000')) // user has 0.2 USDC in wei
          })

          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

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
          modalProps.onGetCrossChainRoute = createOnGetCrossChainRouteMockForUSDC(
            route,
            ChainId.MATIC_MAINNET,
            '0.438482'
          )
        })

        describe('and has enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('2000000')) // user has 2 USDC in wei
          })

          it('should render the switch network button to send the tx', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(chainSelector)

            const polygonNetworkOption = await findByText('Polygon')
            fireEvent.click(polygonNetworkOption)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

            expect(
              await findByTestId(SWITCH_NETWORK_BUTTON_TEST_ID)
            ).toBeInTheDocument()
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('200000')) // user has 0.2 USDC in wei
          })
          it('should render the get MANA and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(chainSelector)

            const polygonNetworkOption = await findByText(/Polygon/)
            fireEvent.click(polygonNetworkOption)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

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

    describe('and tries to buy a Polygon asset', () => {
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
        describe('and it is an asset suitable for a meta tx', () => {
          beforeEach(() => {
            modalProps.price = BigNumber.from(getMinSaleValueInWei())
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
              modalProps.metadata = {
                asset: {
                  ...MOCKED_ITEM,
                  ...(modalProps.metadata ? modalProps.metadata.asset : {})
                }
              }
            })

            it('should render the buy now button and free transaction label and call on onBuyNatively on click', async () => {
              const { getByTestId } = await renderBuyWithCryptoModal(modalProps)
              const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)

              expect(buyNowButton).toBeInTheDocument()
              expect(getByTestId(FREE_TX_COVERED_TEST_ID)).toBeInTheDocument()

              fireEvent.click(buyNowButton)

              await waitFor(() =>
                expect(modalProps.onBuyNatively).toHaveBeenCalled()
              )
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
            modalProps.price = BigNumber.from(getMinSaleValueInWei())
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

              fireEvent.click(switchNetworkButton)

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
          modalProps.onGetCrossChainRoute = createOnGetCrossChainRouteMockForUSDC(
            route,
            ChainId.ETHEREUM_MAINNET,
            '0.438482'
          )
        })

        describe('and has enough token balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('2000000')) // user has 2 USDC in wei
          })

          it('should render buy now button and call the onBuyCrossChain', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(chainSelector)

            const ethereumNetworkOption = await findByText('Ethereum')
            fireEvent.click(ethereumNetworkOption)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

            const buyNowButton = await findByTestId(BUY_NOW_BUTTON_TEST_ID)
            expect(buyNowButton).toBeInTheDocument()

            fireEvent.click(buyNowButton)
            await waitFor(() => {
              expect(modalProps.onBuyCrossChain).toHaveBeenCalledWith(route)
            })
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('200000')) // user has 0.2 USDC in wei
          })
          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(chainSelector)

            const ethereumNetworkOption = await findByText('Ethereum')
            fireEvent.click(ethereumNetworkOption)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

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
          modalProps.onGetCrossChainRoute = createOnGetCrossChainRouteMockForUSDC(
            route,
            ChainId.MATIC_MAINNET,
            '0.438482'
          )
        })

        describe('and has enough token balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('2000000')) // user has 2 USDC in wei
            modalProps.onSwitchNetwork = jest.fn()
          })

          it('should render the switch network button and call the onSwitchNetwork fn on click', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

            const switchNetworkButton = await findByTestId(
              SWITCH_NETWORK_BUTTON_TEST_ID
            )

            expect(switchNetworkButton).toBeInTheDocument()

            fireEvent.click(switchNetworkButton)

            await waitFor(() =>
              expect(modalProps.onSwitchNetwork).toHaveBeenCalled()
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('200000')) // user has 0.2 USDC in wei
          })

          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(chainSelector)

            const ethereumNetworkOption = await findByText('Ethereum')
            fireEvent.click(ethereumNetworkOption)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

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

    describe('and tries to buy an Ethereum asset', () => {
      beforeEach(() => {
        ;(modalProps.metadata?.asset as Item).network = Network.ETHEREUM
        ;(modalProps.metadata?.asset as Item).chainId = ChainId.ETHEREUM_MAINNET
      })

      describe('and wants to pay with MANA', () => {
        describe('and has enough MANA balance in Ethereum to buy the asset', () => {
          beforeEach(() => {
            modalProps.price = '10000000000000000' // 0.1 MANA
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

            fireEvent.click(switchNetworkButton)
            expect(modalProps.onSwitchNetwork).toHaveBeenCalledWith(
              ChainId.ETHEREUM_MAINNET
            )
          })
        })

        describe('and does not have enough MANA balance in Ethereum to buy the asset', () => {
          beforeEach(() => {
            modalProps.price = '10000000000000000' // 0.1 MANA
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
          modalProps.onGetCrossChainRoute = createOnGetCrossChainRouteMockForUSDC(
            route,
            ChainId.ETHEREUM_MAINNET,
            '0.438482'
          )
          modalProps.onSwitchNetwork = jest.fn()
        })

        describe('and has enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('2000000')) // user has 2 USDC in wei
          })

          it('should render the switch network button and call the onSwitchNetwork on the click', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

            const switchNetworkButton = await findByTestId(
              SWITCH_NETWORK_BUTTON_TEST_ID
            )

            expect(switchNetworkButton).toBeInTheDocument()

            fireEvent.click(switchNetworkButton)

            await waitFor(() =>
              expect(modalProps.onSwitchNetwork).toHaveBeenCalledWith(
                ChainId.ETHEREUM_MAINNET
              )
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('200000')) // user has .02 USDC in wei
          })

          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

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
          modalProps.onGetCrossChainRoute = createOnGetCrossChainRouteMockForUSDC(
            route,
            ChainId.ETHEREUM_MAINNET,
            '0.438482'
          )
        })

        describe('and has enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('2000000')) // user has 2 USDC in wei
          })
          it('should render the switch network button to send the tx', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

            expect(
              await findByTestId(SWITCH_NETWORK_BUTTON_TEST_ID)
            ).toBeInTheDocument()
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('200000')) // user has 0.2 USDC in wei
          })

          it('should render the get MANA and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

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

            modalProps.metadata = {
              asset: {
                ...MOCKED_ITEM,
                ...(modalProps.metadata ? modalProps.metadata.asset : {})
              }
            }
          })

          it('should render the buy now button and call on onBuyNatively on the click', async () => {
            const {
              queryByTestId,
              getByTestId
            } = await renderBuyWithCryptoModal(modalProps)
            const buyNowButton = getByTestId(BUY_NOW_BUTTON_TEST_ID)

            expect(buyNowButton).toBeInTheDocument()
            expect(
              queryByTestId(FREE_TX_COVERED_TEST_ID)
            ).not.toBeInTheDocument() // do not show the free tx covered label

            fireEvent.click(buyNowButton)

            await waitFor(() =>
              expect(modalProps.onBuyNatively).toHaveBeenCalled()
            )
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
          modalProps.onGetCrossChainRoute = createOnGetCrossChainRouteMockForUSDC(
            route,
            ChainId.ETHEREUM_MAINNET,
            '0.438482'
          )
          modalProps.onSwitchNetwork = jest.fn()
        })

        describe('and has enough token balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('2000000')) // user has 2 USDC in wei
          })

          it('should render switch network button and call the onSwitchNetwork', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(chainSelector)

            const ethereumNetworkOption = await findByText('Ethereum')
            fireEvent.click(ethereumNetworkOption)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

            const switchNetworkButton = await findByTestId(
              SWITCH_NETWORK_BUTTON_TEST_ID
            )

            expect(switchNetworkButton).toBeInTheDocument()
            fireEvent.click(switchNetworkButton)

            await waitFor(() =>
              expect(modalProps.onSwitchNetwork).toHaveBeenCalledWith(
                ChainId.ETHEREUM_MAINNET
              )
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('200000')) // user has 0.2 USDC in wei
          })

          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(chainSelector)

            const ethereumNetworkOption = await findByText('Ethereum')
            fireEvent.click(ethereumNetworkOption)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

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
          modalProps.onGetCrossChainRoute = createOnGetCrossChainRouteMockForUSDC(
            route,
            ChainId.MATIC_MAINNET,
            '0.438482'
          )
        })

        describe('and has enough token balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('2000000')) // user has 2 USDC in wei
          })

          it('should render the buy now button and call the onBuyCrossChain fn on click', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

            const buyNowButton = await findByTestId(BUY_NOW_BUTTON_TEST_ID)

            expect(buyNowButton).toBeInTheDocument()
            fireEvent.click(buyNowButton)

            await waitFor(() =>
              expect(modalProps.onBuyCrossChain).toHaveBeenCalledWith(route)
            )
          })
        })

        describe('and does not have enough balance to buy it', () => {
          beforeEach(() => {
            mockUseTokenBalance(false, BigNumber.from('200000')) // user has 0.2 USDC in wei
          })

          it('should render the get mana and buy with card buttons', async () => {
            const {
              getByTestId,
              findByTestId,
              findByText
            } = await renderBuyWithCryptoModal(modalProps)

            const chainSelector = getByTestId(CHAIN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(chainSelector)

            const ethereumNetworkOption = await findByText('Ethereum')
            fireEvent.click(ethereumNetworkOption)

            const tokenSelector = getByTestId(TOKEN_SELECTOR_DATA_TEST_ID)
            fireEvent.click(tokenSelector)

            const usdcTokenOption = await findByText('USDC')
            fireEvent.click(usdcTokenOption)

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
