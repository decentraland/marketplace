import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChainId, Item, Network, Order } from '@dcl/schemas'
import { ContractName, getContract } from 'decentraland-transactions'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import {
  CrossChainProvider,
  Route,
  RouteResponse,
  Token
} from 'decentraland-transactions/crossChain'
import { NFT } from '../../../modules/nft/types'
import * as events from '../../../utils/events'
import { isPriceTooLow } from '../../BuyPage/utils'
import {
  estimateTransactionGas as estimateMintingOrBuyingTransactionGas,
  formatPrice,
  getShouldUseMetaTx
} from './utils'

const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const ROUTE_FETCH_INTERVAL = 10000000 // 10 secs

export const useShouldUseCrossChainProvider = (
  selectedToken: Token,
  selectedChain: ChainId,
  assetNetwork: Network
) => {
  return useMemo(
    () =>
      selectedToken &&
      !(
        (
          (selectedToken.symbol === 'MANA' &&
            getNetwork(selectedChain) === Network.MATIC &&
            assetNetwork === Network.MATIC) || // MANA selected and it's sending the tx from MATIC
          (selectedToken.symbol === 'MANA' &&
            getNetwork(selectedChain) === Network.ETHEREUM &&
            assetNetwork === Network.ETHEREUM)
        ) // MANA selected and it's connected to ETH and buying a L1 NFT
      ),
    [assetNetwork, selectedChain, selectedToken]
  )
}

export type TokenBalance = {
  isFetchingBalance: boolean
  tokenBalance: BigNumber | undefined
}

// Retrieves the token balance for the selected token in the selected chain for the user's address
export const useTokenBalance = (
  selectedToken: Token,
  selectedChain: ChainId,
  address: string | undefined | null
): TokenBalance => {
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<BigNumber>()

  // fetch selected token balance & price
  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setIsFetchingBalance(true)
        if (
          selectedChain &&
          selectedToken &&
          selectedToken.symbol !== 'MANA' && // mana balance is already available in the wallet
          address
        ) {
          const networkProvider = await getNetworkProvider(selectedChain)
          const provider = new ethers.providers.Web3Provider(networkProvider)

          // if native token
          if (selectedToken.address === NATIVE_TOKEN) {
            const balanceWei = await provider.send('eth_getBalance', [
              address,
              'latest'
            ])
            setSelectedTokenBalance(balanceWei)

            return
          }
          // else ERC20
          const tokenContract = new ethers.Contract(
            selectedToken.address,
            ['function balanceOf(address owner) view returns (uint256)'],
            provider
          )
          const balance: BigNumber = await tokenContract.balanceOf(address)

          if (!cancel) {
            setSelectedTokenBalance(balance)
          }
        }
      } catch (error) {
        console.error('Error getting balance: ', error)
      } finally {
        if (!cancel) {
          setIsFetchingBalance(false)
        }
      }
    })()
    return () => {
      cancel = true
    }
  }, [selectedToken, selectedChain, address])

  return { isFetchingBalance, tokenBalance: selectedTokenBalance }
}

export type GasCostValues = {
  total: string
  token: Token | undefined
  totalUSDPrice: number | undefined
}

export type GasCost = {
  gasCost: GasCostValues | undefined
  isFetchingGasCost: boolean
}

const useGasCost = (
  price: string,
  assetNetwork: Network,
  providerTokens: Token[],
  selectedChain: ChainId,
  shouldUseCrossChainProvider: boolean,
  wallet: Wallet | undefined | null,
  estimateTransactionGas: () => Promise<BigNumber | undefined>
): GasCost => {
  const [gasCost, setGasCost] = useState<GasCostValues>()
  const [isFetchingGasCost, setIsFetchingGasCost] = useState(false)

  useEffect(() => {
    const calculateGas = async () => {
      try {
        setIsFetchingGasCost(true)
        const networkProvider = await getNetworkProvider(selectedChain)
        const provider = new ethers.providers.Web3Provider(networkProvider)
        const gasPrice: BigNumber = await provider.getGasPrice()
        const estimation = await estimateTransactionGas()

        if (estimation && providerTokens.length) {
          const total = estimation.mul(gasPrice)
          const nativeToken = providerTokens.find(
            t => +t.chainId === selectedChain && t.address === NATIVE_TOKEN
          )
          const totalUSDPrice = nativeToken?.usdPrice
            ? nativeToken.usdPrice * +ethers.utils.formatEther(total)
            : undefined

          setGasCost({
            token: nativeToken,
            total: ethers.utils.formatEther(total),
            totalUSDPrice
          })
        }
        setIsFetchingGasCost(false)
      } catch (error) {
        setIsFetchingGasCost(false)
      }
    }

    if (
      !shouldUseCrossChainProvider &&
      ((wallet &&
        getNetwork(wallet.chainId) === Network.MATIC &&
        assetNetwork === Network.MATIC) ||
        price === '0' ||
        isPriceTooLow(price))
    ) {
      calculateGas()
    } else {
      setGasCost(undefined)
    }
  }, [
    assetNetwork,
    estimateTransactionGas,
    price,
    providerTokens,
    selectedChain,
    shouldUseCrossChainProvider,
    wallet
  ])

  return { gasCost, isFetchingGasCost }
}

export const useMintingNftGasCost = (
  item: Item,
  selectedToken: Token,
  selectedChain: ChainId,
  wallet: Wallet | null,
  providerTokens: Token[]
): GasCost => {
  const estimateGas = useCallback(
    () =>
      wallet
        ? estimateMintingOrBuyingTransactionGas(selectedChain, wallet, item)
        : Promise.resolve(undefined),
    [selectedChain, wallet, item]
  )
  const shouldUseCrossChainProvider = useShouldUseCrossChainProvider(
    selectedToken,
    selectedChain,
    item.network
  )
  return useGasCost(
    item.price,
    item.network,
    providerTokens,
    selectedChain,
    shouldUseCrossChainProvider,
    wallet,
    estimateGas
  )
}

export const useBuyNftGasCost = (
  nft: NFT,
  order: Order,
  selectedToken: Token,
  selectedChain: ChainId,
  wallet: Wallet | null,
  providerTokens: Token[]
): GasCost => {
  const estimateGas = useCallback(
    () =>
      wallet
        ? estimateMintingOrBuyingTransactionGas(
            selectedChain,
            wallet,
            nft,
            order
          )
        : Promise.resolve(undefined),
    [selectedChain, wallet, order]
  )
  const shouldUseCrossChainProvider = useShouldUseCrossChainProvider(
    selectedToken,
    selectedChain,
    order.network
  )
  return useGasCost(
    order.price,
    order.network,
    providerTokens,
    selectedChain,
    shouldUseCrossChainProvider,
    wallet,
    estimateGas
  )
}

export const useCrossChainMintNftRoute = (
  item: Item,
  assetChainId: ChainId,
  selectedToken: Token,
  selectedChain: ChainId,
  providerTokens: Token[],
  crossChainProvider: CrossChainProvider | undefined,
  wallet: Wallet | null
) => {
  const getMintNFTRoute = useCallback(
    (fromAddress, fromAmount, fromChain, fromToken, crossChainProvider) =>
      crossChainProvider.getMintNFTRoute({
        fromAddress,
        fromAmount,
        fromToken,
        fromChain,
        toAmount: item.price,
        toChain: item.chainId,
        item: {
          collectionAddress: item.contractAddress,
          itemId: item.itemId,
          price: item.price
        }
      }),
    [item]
  )

  return useCrossChainRoute(
    item.price,
    assetChainId,
    selectedToken,
    selectedChain,
    providerTokens,
    crossChainProvider,
    wallet,
    getMintNFTRoute
  )
}

export const useCrossChainBuyNftRoute = (
  order: Order,
  assetChainId: ChainId,
  selectedToken: Token,
  selectedChain: ChainId,
  providerTokens: Token[],
  crossChainProvider: CrossChainProvider | undefined,
  wallet: Wallet | null
): CrossChainRoute => {
  const getBuyNftRoute = useCallback(
    (fromAddress, fromAmount, fromChain, fromToken, crossChainProvider) =>
      crossChainProvider.getBuyNFTRoute({
        fromAddress,
        fromAmount,
        fromChain,
        fromToken,
        toAmount: order.price,
        toChain: order.chainId,
        nft: {
          collectionAddress: order.contractAddress,
          tokenId: order.tokenId,
          price: order.price
        }
      }),
    [order]
  )

  return useCrossChainRoute(
    order.price,
    assetChainId,
    selectedToken,
    selectedChain,
    providerTokens,
    crossChainProvider,
    wallet,
    getBuyNftRoute
  )
}

export type RouteFeeCost = {
  token: Token
  gasCostWei: BigNumber
  gasCost: string
  feeCost: string
  feeCostWei: BigNumber
  totalCost: string
}

export type CrossChainRoute = {
  route: Route | undefined
  fromAmount: string | undefined
  routeFeeCost: RouteFeeCost | undefined
  routeTotalUSDCost: number | undefined
  isFetchingRoute: boolean
  routeFailed: boolean
}

const useCrossChainRoute = (
  price: string,
  assetChainId: ChainId,
  selectedToken: Token,
  selectedChain: ChainId,
  providerTokens: Token[],
  crossChainProvider: CrossChainProvider | undefined,
  wallet: Wallet | null,
  getRoute: (
    fromAddress: string,
    fromAmount: string,
    fromChain: ChainId,
    fromToken: string,
    crossChainProvider: CrossChainProvider | undefined
  ) => Promise<Route>
): CrossChainRoute => {
  const [isFetchingRoute, setIsFetchingRoute] = useState(false)
  const [routeFailed, setRouteFailed] = useState(false)
  const [fromAmount, setFromAmount] = useState<string>()
  const [route, setRoute] = useState<Route>()
  const abortControllerRef = useRef(new AbortController())
  const destinationChainMANAContractAddress = useMemo(
    () => getContract(ContractName.MANAToken, assetChainId).address,
    [assetChainId]
  )

  const calculateRoute = useCallback(async () => {
    const abortController = abortControllerRef.current
    const signal = abortController.signal
    const providerMANA = providerTokens.find(
      t =>
        t.address.toLocaleLowerCase() ===
        destinationChainMANAContractAddress.toLocaleLowerCase()
    )
    if (
      !crossChainProvider ||
      !crossChainProvider.isLibInitialized() ||
      !wallet ||
      !selectedToken ||
      !providerMANA
    ) {
      return
    }
    try {
      setRoute(undefined)
      setIsFetchingRoute(true)
      setRouteFailed(false)
      const fromAmountParams = {
        fromToken: selectedToken,
        toAmount: ethers.utils.formatEther(price),
        toToken: providerMANA
      }
      const fromAmount = Number(
        await crossChainProvider.getFromAmount(fromAmountParams)
      ).toFixed(6)
      setFromAmount(fromAmount)

      const fromAmountWei = ethers.utils
        .parseUnits(fromAmount.toString(), selectedToken.decimals)
        .toString()

      const route: RouteResponse | undefined = await getRoute(
        wallet.address,
        fromAmountWei,
        selectedChain,
        selectedToken.address,
        crossChainProvider
      )

      if (route && !signal.aborted) {
        setRoute(route)
      }
    } catch (error) {
      console.error('Error while getting Route: ', error)
      getAnalytics().track(events.ERROR_GETTING_ROUTE, {
        error,
        selectedToken,
        selectedChain
      })
      setRouteFailed(true)
    } finally {
      setIsFetchingRoute(false)
    }
  }, [
    crossChainProvider,
    price,
    providerTokens,
    selectedChain,
    selectedToken,
    wallet
  ])

  const useMetaTx = useMemo(() => {
    return (
      !!selectedToken &&
      !!wallet &&
      getShouldUseMetaTx(
        assetChainId,
        selectedChain,
        selectedToken.address,
        destinationChainMANAContractAddress,
        wallet.network
      )
    )
  }, [
    destinationChainMANAContractAddress,
    selectedChain,
    selectedToken,
    wallet
  ])

  // Refresh the route every ROUTE_FETCH_INTERVAL
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined
    if (route) {
      if (interval) {
        clearInterval(interval)
      }

      interval = setInterval(() => {
        calculateRoute()
      }, ROUTE_FETCH_INTERVAL)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [calculateRoute, route])

  // Refresh the route every time the selected token changes
  useEffect(() => {
    if (
      selectedToken &&
      !route &&
      !isFetchingRoute &&
      !useMetaTx &&
      !routeFailed
    ) {
      const isBuyingL1WithOtherTokenThanEthereumMANA =
        assetChainId === ChainId.ETHEREUM_MAINNET &&
        selectedToken.chainId !== ChainId.ETHEREUM_MAINNET.toString() &&
        selectedToken.symbol !== 'MANA'

      const isPayingWithOtherTokenThanMANA = selectedToken.symbol !== 'MANA'
      const isPayingWithMANAButFromOtherChain =
        selectedToken.symbol === 'MANA' &&
        selectedToken.chainId !== assetChainId.toString()

      if (
        isBuyingL1WithOtherTokenThanEthereumMANA ||
        isPayingWithOtherTokenThanMANA ||
        isPayingWithMANAButFromOtherChain
      ) {
        calculateRoute()
      }
    }
  }, [
    route,
    useMetaTx,
    routeFailed,
    selectedToken,
    isFetchingRoute,
    selectedChain,
    assetChainId,
    calculateRoute
  ])

  const routeFeeCost = useMemo(() => {
    if (route) {
      const {
        route: {
          estimate: { gasCosts, feeCosts }
        }
      } = route
      const totalGasCost = gasCosts
        .map(c => BigNumber.from(c.amount))
        .reduce((a, b) => a.add(b), BigNumber.from(0))
      const totalFeeCost = feeCosts
        .map(c => BigNumber.from(c.amount))
        .reduce((a, b) => a.add(b), BigNumber.from(0))
      const token = gasCosts[0].token
      return {
        token,
        gasCostWei: totalGasCost,
        gasCost: formatPrice(
          ethers.utils.formatUnits(
            totalGasCost,
            route.route.estimate.gasCosts[0].token.decimals
          ),
          route.route.estimate.gasCosts[0].token
        ).toString(),
        feeCost: formatPrice(
          ethers.utils.formatUnits(
            totalFeeCost,
            route.route.estimate.gasCosts[0].token.decimals
          ),
          route.route.estimate.gasCosts[0].token
        ).toString(),
        feeCostWei: totalFeeCost,
        totalCost: parseFloat(
          ethers.utils.formatUnits(
            totalGasCost.add(totalFeeCost),
            token.decimals
          )
        ).toFixed(6)
      }
    }
  }, [route])

  const routeTotalUSDCost = useMemo(() => {
    if (route && routeFeeCost && fromAmount && selectedToken?.usdPrice) {
      const { feeCost, gasCost } = routeFeeCost
      const feeTokenUSDPrice = providerTokens.find(
        t => t.symbol === routeFeeCost.token.symbol
      )?.usdPrice
      return feeTokenUSDPrice
        ? feeTokenUSDPrice * (Number(gasCost) + Number(feeCost)) +
            selectedToken.usdPrice * Number(fromAmount)
        : undefined
    }
  }, [fromAmount, providerTokens, route, routeFeeCost, selectedToken.usdPrice])

  return {
    route,
    fromAmount,
    routeFeeCost,
    routeTotalUSDCost,
    isFetchingRoute,
    routeFailed
  }
}
