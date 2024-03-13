import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChainId, Item, Network, Order } from '@dcl/schemas'
import { ContractName, getContract } from 'decentraland-transactions'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import type { CrossChainProvider, Route, RouteResponse, Token } from 'decentraland-transactions/crossChain'
import { NFT } from '../../../modules/nft/types'
import * as events from '../../../utils/events'
import { estimateBuyNftGas, estimateMintNftGas, estimateNameMintingGas, formatPrice, getShouldUseMetaTx } from './utils'

export const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const ROUTE_FETCH_INTERVAL = 10000000 // 10 secs

export const useShouldUseCrossChainProvider = (selectedToken: Token, assetNetwork: Network) => {
  return useMemo(
    () =>
      !(
        (selectedToken.symbol === 'MANA' &&
          getNetwork(parseInt(selectedToken.chainId) as ChainId) === Network.MATIC &&
          assetNetwork === Network.MATIC) || // MANA selected and it's sending the tx from MATIC
        (selectedToken.symbol === 'MANA' &&
          getNetwork(parseInt(selectedToken.chainId) as ChainId) === Network.ETHEREUM &&
          assetNetwork === Network.ETHEREUM)
      ), // MANA selected and it's connected to ETH and buying a L1 NFT
    [assetNetwork, selectedToken]
  )
}

export type TokenBalance = {
  isFetchingBalance: boolean
  tokenBalance: BigNumber | undefined
}

// Retrieves the token balance for the selected token in the selected chain for the user's address
export const useTokenBalance = (selectedToken: Token, selectedChain: ChainId, address: string | undefined | null): TokenBalance => {
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<BigNumber>()

  // fetch selected token balance & price
  useEffect(() => {
    let cancel = false
    void (async () => {
      try {
        setIsFetchingBalance(true)
        if (
          selectedToken.symbol !== 'MANA' && // mana balance is already available in the wallet
          address
        ) {
          const networkProvider = await getNetworkProvider(selectedChain)
          const provider = new ethers.providers.Web3Provider(networkProvider)

          // if native token
          if (selectedToken.address === NATIVE_TOKEN) {
            const balanceWei = await provider.send('eth_getBalance', [address, 'latest'])

            if (!cancel) {
              setSelectedTokenBalance(balanceWei)
            }
          } else {
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
  assetNetwork: Network,
  nativeChainToken: Token | undefined,
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

        if (estimation) {
          const total = estimation.mul(gasPrice)
          const totalUSDPrice = nativeChainToken?.usdPrice ? nativeChainToken.usdPrice * +ethers.utils.formatEther(total) : undefined

          setGasCost({
            token: nativeChainToken,
            total: ethers.utils.formatEther(total),
            totalUSDPrice
          })
        }
        setIsFetchingGasCost(false)
      } catch (error) {
        setIsFetchingGasCost(false)
      }
    }

    if (!shouldUseCrossChainProvider && wallet && nativeChainToken && getNetwork(wallet.chainId) === assetNetwork) {
      void calculateGas()
    } else {
      setGasCost(undefined)
    }
  }, [assetNetwork, estimateTransactionGas, nativeChainToken, selectedChain, shouldUseCrossChainProvider, wallet])

  return { gasCost, isFetchingGasCost }
}

export const useMintingNftGasCost = (
  item: Item,
  selectedToken: Token,
  chainNativeToken: Token | undefined,
  wallet: Wallet | null
): GasCost => {
  const chainId = parseInt(selectedToken.chainId) as ChainId

  const estimateGas = useCallback(
    () => (wallet ? estimateMintNftGas(chainId, wallet, item) : Promise.resolve(undefined)),
    [chainId, wallet, item]
  )
  const shouldUseCrossChainProvider = useShouldUseCrossChainProvider(selectedToken, item.network)

  return useGasCost(item.network, chainNativeToken, chainId, shouldUseCrossChainProvider, wallet, estimateGas)
}

export const useBuyNftGasCost = (
  nft: NFT,
  order: Order,
  selectedToken: Token,
  chainNativeToken: Token | undefined,
  wallet: Wallet | null
): GasCost => {
  const chainId = parseInt(selectedToken.chainId) as ChainId

  const estimateGas = useCallback(
    () => (wallet ? estimateBuyNftGas(chainId, wallet, nft, order) : Promise.resolve(undefined)),
    [chainId, wallet, order]
  )
  const shouldUseCrossChainProvider = useShouldUseCrossChainProvider(selectedToken, order.network)

  return useGasCost(order.network, chainNativeToken, chainId, shouldUseCrossChainProvider, wallet, estimateGas)
}

export const useNameMintingGasCost = (name: string, selectedToken: Token, chainNativeToken: Token | undefined, wallet: Wallet | null) => {
  const chainId = parseInt(selectedToken.chainId) as ChainId

  const estimateGas = useCallback(
    () => (wallet?.address ? estimateNameMintingGas(name, chainId, wallet?.address) : Promise.resolve(undefined)),
    [name, chainId, wallet?.address]
  )

  const shouldUseCrossChainProvider = useShouldUseCrossChainProvider(selectedToken, Network.ETHEREUM)

  return useGasCost(Network.ETHEREUM, chainNativeToken, chainId, shouldUseCrossChainProvider, wallet, estimateGas)
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
  wallet: Wallet | null,
  slippage: number
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
        },
        slippage
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

export const useCrossChainNameMintingRoute = (
  name: string,
  price: string,
  assetChainId: ChainId,
  selectedToken: Token,
  selectedChain: ChainId,
  providerTokens: Token[],
  crossChain: CrossChainProvider | undefined,
  wallet: Wallet | null
) => {
  const getMintingNameRoute = useCallback(
    (fromAddress, fromAmount, fromChain, fromToken, crossChainProvider) =>
      crossChainProvider.getRegisterNameRoute({
        name,
        fromAddress,
        fromAmount,
        fromChain,
        fromToken,
        toAmount: price,
        toChain: assetChainId
      }),
    [name, assetChainId, price]
  )
  return useCrossChainRoute(price, assetChainId, selectedToken, selectedChain, providerTokens, crossChain, wallet, getMintingNameRoute)
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
    crossChainProvider: CrossChainProvider
  ) => Promise<Route>
): CrossChainRoute => {
  const [isFetchingRoute, setIsFetchingRoute] = useState(false)
  const [routeFailed, setRouteFailed] = useState(false)
  const [fromAmount, setFromAmount] = useState<string>()
  const [route, setRoute] = useState<Route>()
  const abortControllerRef = useRef(new AbortController())
  const destinationChainMANAContractAddress = useMemo(() => getContract(ContractName.MANAToken, assetChainId).address, [assetChainId])

  const calculateRoute = useCallback(async () => {
    abortControllerRef.current = new AbortController()
    const abortController = abortControllerRef.current
    const signal = abortController.signal
    const providerMANA = providerTokens.find(t => t.address.toLocaleLowerCase() === destinationChainMANAContractAddress.toLocaleLowerCase())
    if (!crossChainProvider || !crossChainProvider.isLibInitialized() || !wallet || !providerMANA) {
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
      const fromAmount = Number(await crossChainProvider.getFromAmount(fromAmountParams)).toFixed(6)
      setFromAmount(fromAmount)

      const fromAmountWei = ethers.utils.parseUnits(fromAmount.toString(), selectedToken.decimals).toString()

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
  }, [crossChainProvider, price, providerTokens, selectedChain, selectedToken, wallet])

  const useMetaTx = useMemo(() => {
    return (
      !!wallet &&
      getShouldUseMetaTx(assetChainId, selectedChain, selectedToken.address, destinationChainMANAContractAddress, wallet.network)
    )
  }, [destinationChainMANAContractAddress, selectedChain, selectedToken, wallet])

  // Refresh the route every ROUTE_FETCH_INTERVAL
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined
    if (route) {
      if (interval) {
        clearInterval(interval)
      }

      interval = setInterval(() => {
        return calculateRoute()
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
    // Abort previous request
    const abortController = abortControllerRef.current
    abortController.abort()

    if (!useMetaTx) {
      const isBuyingL1WithOtherTokenThanEthereumMANA =
        assetChainId === ChainId.ETHEREUM_MAINNET &&
        selectedToken.chainId !== ChainId.ETHEREUM_MAINNET.toString() &&
        selectedToken.symbol !== 'MANA'

      const isPayingWithOtherTokenThanMANA = selectedToken.symbol !== 'MANA'
      const isPayingWithMANAButFromOtherChain = selectedToken.symbol === 'MANA' && selectedToken.chainId !== assetChainId.toString()

      if (isBuyingL1WithOtherTokenThanEthereumMANA || isPayingWithOtherTokenThanMANA || isPayingWithMANAButFromOtherChain) {
        void calculateRoute()
      }
    }
    setRouteFailed(false)
  }, [useMetaTx, selectedToken, selectedChain, assetChainId, calculateRoute])

  const routeFeeCost = useMemo(() => {
    if (route) {
      const {
        route: {
          estimate: { gasCosts, feeCosts }
        }
      } = route
      const totalGasCost = gasCosts.map(c => BigNumber.from(c.amount)).reduce((a, b) => a.add(b), BigNumber.from(0))
      const totalFeeCost = feeCosts.map(c => BigNumber.from(c.amount)).reduce((a, b) => a.add(b), BigNumber.from(0))
      const token = gasCosts[0].token
      return {
        token,
        gasCostWei: totalGasCost,
        gasCost: formatPrice(
          ethers.utils.formatUnits(totalGasCost, route.route.estimate.gasCosts[0].token.decimals),
          route.route.estimate.gasCosts[0].token
        ).toString(),
        feeCost: formatPrice(
          ethers.utils.formatUnits(totalFeeCost, route.route.estimate.gasCosts[0].token.decimals),
          route.route.estimate.gasCosts[0].token
        ).toString(),
        feeCostWei: totalFeeCost,
        totalCost: parseFloat(ethers.utils.formatUnits(totalGasCost.add(totalFeeCost), token.decimals)).toFixed(6)
      }
    }
  }, [route])

  const routeTotalUSDCost = useMemo(() => {
    if (route && routeFeeCost && fromAmount && selectedToken?.usdPrice) {
      const { feeCost, gasCost } = routeFeeCost
      const feeTokenUSDPrice = providerTokens.find(t => t.symbol === routeFeeCost.token.symbol)?.usdPrice
      return feeTokenUSDPrice
        ? feeTokenUSDPrice * (Number(gasCost) + Number(feeCost)) + selectedToken.usdPrice * Number(fromAmount)
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
