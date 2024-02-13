import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import compact from 'lodash/compact'
import { ethers, BigNumber } from 'ethers'
import { ChainId, Contract, Network } from '@dcl/schemas'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import {
  ChainButton,
  withAuthorizedAction
} from 'decentraland-dapps/dist/containers'
import { Button, Icon, Loader, ModalNavigation } from 'decentraland-ui'
import { ContractName, getContract } from 'decentraland-transactions'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
// import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
// import { Contract as DCLContract } from '../../../modules/vendor/services'
// import { getContractNames } from '../../../modules/vendor'
import { isNFT, isWearableOrEmote } from '../../../modules/asset/utils'
import * as events from '../../../utils/events'
import { Mana } from '../../Mana'
import { formatWeiMANA } from '../../../lib/mana'
import {
  CROSS_CHAIN_SUPPORTED_CHAINS,
  ChainData,
  Token,
  CrossChainProvider,
  AxelarProvider
} from 'decentraland-transactions/crossChain'
import { AssetImage } from '../../AssetImage'
import { isPriceTooLow } from '../../BuyPage/utils'
import { CardPaymentsExplanation } from '../../BuyPage/CardPaymentsExplanation'
import { ManaToFiat } from '../../ManaToFiat'
import { getBuyItemStatus, getError } from '../../../modules/order/selectors'
import { getMintItemStatus } from '../../../modules/item/selectors'
// import { NFT } from '../../../modules/nft/types'
import { config } from '../../../config'
import ChainAndTokenSelector from './ChainAndTokenSelector/ChainAndTokenSelector'
import {
  DEFAULT_CHAINS,
  getDefaultChains,
  getMANAToken,
  getShouldUseMetaTx,
  isToken
} from './utils'
import { Props } from './BuyWithCryptoModal.types'
import styles from './BuyWithCryptoModal.module.css'
import {
  // useGasCost,
  useShouldUseCrossChainProvider,
  useTokenBalance
} from './hooks'
import PaymentSelector from './PaymentSelector/PaymentSelector'
import PurchaseTotal from './PurchaseTotal/PurchaseTotal'

export const CANCEL_DATA_TEST_ID = 'confirm-buy-with-crypto-modal-cancel'
export const BUY_NOW_BUTTON_TEST_ID = 'buy-now-button'
export const SWITCH_NETWORK_BUTTON_TEST_ID = 'switch-network'
export const GET_MANA_BUTTON_TEST_ID = 'get-mana-button'
export const BUY_WITH_CARD_TEST_ID = 'buy-with-card-button'
export const PRICE_TOO_LOW_TEST_ID = 'price-too-low-label'

const ROUTE_FETCH_INTERVAL = 10000000 // 10 secs

export type ProviderChain = ChainData
export type ProviderToken = Token

const squidURL = config.get('SQUID_API_URL')

export const BuyWithCryptoModal = (props: Props) => {
  const {
    wallet,
    metadata: { asset, order },
    getContract: getContractProp,
    isLoading,
    isLoadingBuyCrossChain,
    isLoadingAuthorization,
    isSwitchingNetwork,
    isBuyWithCardPage,
    onAuthorizedAction,
    onSwitchNetwork,
    onBuyNatively,
    onBuyWithCard,
    // onBuyItem: onBuyItemProp,
    onBuyItemThroughProvider,
    // onBuyItemWithCard,
    // onExecuteOrder,
    // onExecuteOrderWithCard,
    onGetMana,
    onClose
  } = props

  const analytics = getAnalytics()
  const destinyChainMANA = getContract(ContractName.MANAToken, asset.chainId)
    .address
  const abortControllerRef = useRef(new AbortController())

  // useStates
  const [providerChains, setProviderChains] = useState<ChainData[]>(
    getDefaultChains()
  )
  const [providerTokens, setProviderTokens] = useState<Token[]>([])
  const [selectedChain, setSelectedChain] = useState(asset.chainId)
  const [selectedToken, setSelectedToken] = useState<Token>(
    getMANAToken(asset.chainId)
  )
  // const [isFetchingRoute, setIsFetchingRoute] = useState(false)
  // const [route, setRoute] = useState<RouteResponse>()
  // const [routeFailed, setRouteFailed] = useState(false)
  const [canBuyItem, setCanBuyItem] = useState<boolean | undefined>(undefined)
  // const [fromAmount, setFromAmount] = useState<string | undefined>(undefined)
  const [showChainSelector, setShowChainSelector] = useState(false)
  const [showTokenSelector, setShowTokenSelector] = useState(false)
  const [crossChainProvider, setCrossChainProvider] = useState<
    CrossChainProvider
  >()

  useEffect(() => {
    const provider = new AxelarProvider(squidURL)
    provider.init() // init the provider on the mount
    setCrossChainProvider(provider)
  }, [])

  const {
    isFetchingBalance,
    tokenBalance: selectedTokenBalance
  } = useTokenBalance(selectedToken, selectedChain, wallet?.address)

  // TODO: Remains here
  // if the tx should be done through the provider
  const shouldUseCrossChainProvider = useShouldUseCrossChainProvider(
    selectedToken,
    selectedChain,
    asset.network
  )

  // Compute if the process should use a meta tx (connected in ETH and buying a L2 NFT)
  const useMetaTx = useMemo(() => {
    return (
      !!selectedToken &&
      !!wallet &&
      getShouldUseMetaTx(
        asset,
        selectedChain,
        selectedToken.address,
        destinyChainMANA,
        wallet.network
      )
    )
  }, [asset, destinyChainMANA, selectedChain, selectedToken, wallet])

  const selectedProviderChain = useMemo(() => {
    return providerChains.find(c => c.chainId === selectedChain.toString())
  }, [providerChains, selectedChain])

  // the price of the order or the item
  // TODO: this should come from the HOC
  // const price = useMemo(
  //   () => (order ? order.price : !isNFT(asset) ? asset.price : ''),
  //   [asset, order]
  // )

  // The gas should be computed as a HOC or be outside of the component, as we want to compute the gas of items, nfts and minting a name.
  // const { gasCost, isFetchingGasCost } = useGasCost(
  //   asset,
  //   order,
  //   price,
  //   providerTokens,
  //   selectedChain,
  //   shouldUseCrossChainProvider,
  //   wallet
  // )

  // Compute if the price is too low for meta tx
  const hasLowPriceForMetaTx = useMemo(
    () => wallet?.chainId !== ChainId.MATIC_MAINNET && isPriceTooLow(price), // not connected to polygon AND has price < minimun for meta tx
    [price, wallet?.chainId]
  )

  // TODO: use in route hook
  // Compute the route fee cost
  // const routeFeeCost = useMemo(() => {
  //   if (route) {
  //     const {
  //       route: {
  //         estimate: { gasCosts, feeCosts }
  //       }
  //     } = route
  //     const totalGasCost = gasCosts
  //       .map(c => BigNumber.from(c.amount))
  //       .reduce((a, b) => a.add(b), BigNumber.from(0))
  //     const totalFeeCost = feeCosts
  //       .map(c => BigNumber.from(c.amount))
  //       .reduce((a, b) => a.add(b), BigNumber.from(0))
  //     const token = gasCosts[0].token
  //     return {
  //       token,
  //       gasCostWei: totalGasCost,
  //       gasCost: parseFloat(
  //         ethers.utils.formatUnits(
  //           totalGasCost,
  //           route.route.estimate.gasCosts[0].token.decimals
  //         )
  //       ).toFixed(6),
  //       feeCost: parseFloat(
  //         ethers.utils.formatUnits(
  //           totalFeeCost,
  //           route.route.estimate.gasCosts[0].token.decimals
  //         )
  //       ).toFixed(6),
  //       feeCostWei: totalFeeCost,
  //       totalCost: parseFloat(
  //         ethers.utils.formatUnits(
  //           totalGasCost.add(totalFeeCost),
  //           token.decimals
  //         )
  //       ).toFixed(6)
  //     }
  //   }
  // }, [route])

  // TODO: move to route hook
  // const routeTotalUSDCost = useMemo(() => {
  //   if (route && routeFeeCost && fromAmount && selectedToken?.usdPrice) {
  //     const { feeCost, gasCost } = routeFeeCost
  //     const feeTokenUSDPrice = providerTokens.find(
  //       t => t.symbol === routeFeeCost.token.symbol
  //     )?.usdPrice
  //     return feeTokenUSDPrice
  //       ? feeTokenUSDPrice * (Number(gasCost) + Number(feeCost)) +
  //           selectedToken.usdPrice * Number(fromAmount)
  //       : undefined
  //   }
  // }, [fromAmount, providerTokens, route, routeFeeCost, selectedToken.usdPrice])

  // useEffects

  // init lib if necessary and fetch chains & supported tokens
  useEffect(() => {
    ;(async () => {
      try {
        if (crossChainProvider) {
          if (!crossChainProvider.isLibInitialized()) {
            await crossChainProvider.init()
          }
          const supportedTokens = crossChainProvider.getSupportedTokens()
          const supportedChains = [
            ...DEFAULT_CHAINS,
            ...crossChainProvider
              .getSupportedChains()
              .filter(c => DEFAULT_CHAINS.every(dc => dc.chainId !== c.chainId))
          ] // keep the defaults since we support MANA on them natively
          setProviderChains(
            supportedChains.filter(
              c =>
                CROSS_CHAIN_SUPPORTED_CHAINS.includes(+c.chainId) &&
                getDefaultChains().find(t => t.chainId === c.chainId)
            )
          )
          setProviderTokens(
            supportedTokens.filter(t =>
              CROSS_CHAIN_SUPPORTED_CHAINS.includes(+t.chainId)
            )
          )
        }
      } catch (error) {
        console.log('error: ', error)
      }
    })()
  }, [crossChainProvider, wallet])

  // TODO: Receive route in this function.
  // calculates Route for the selectedToken
  // const calculateRoute = useCallback(async () => {
  //   const abortController = abortControllerRef.current
  //   const signal = abortController.signal

  //   const providerMANA = providerTokens.find(
  //     t =>
  //       t.address.toLocaleLowerCase() === destinyChainMANA.toLocaleLowerCase()
  //   )
  //   if (
  //     !crossChainProvider ||
  //     !crossChainProvider.isLibInitialized() ||
  //     !wallet ||
  //     !selectedToken ||
  //     !providerMANA
  //   ) {
  //     return
  //   }
  //   try {
  //     setRoute(undefined)
  //     setIsFetchingRoute(true)
  //     setRouteFailed(false)
  //     let route: RouteResponse | undefined = undefined
  //     const fromAmountParams = {
  //       fromToken: selectedToken,
  //       toAmount: ethers.utils.formatEther(price),
  //       toToken: providerMANA
  //     }
  //     const fromAmount = Number(
  //       await crossChainProvider.getFromAmount(fromAmountParams)
  //     ).toFixed(6)
  //     setFromAmount(fromAmount)

  //     const fromAmountWei = ethers.utils
  //       .parseUnits(fromAmount.toString(), selectedToken.decimals)
  //       .toString()

  //     const baseRouteConfig = {
  //       fromAddress: wallet.address,
  //       fromAmount: fromAmountWei,
  //       fromChain: selectedChain,
  //       fromToken: selectedToken.address
  //     }

  //     if (order) {
  //       // there's an order so it's buying an NFT
  //       route = await crossChainProvider.getBuyNFTRoute({
  //         ...baseRouteConfig,
  //         nft: {
  //           collectionAddress: order.contractAddress,
  //           tokenId: order.tokenId,
  //           price: order.price
  //         },
  //         toAmount: order.price,
  //         toChain: order.chainId
  //       })
  //     } else if (!isNFT(asset)) {
  //       // buying an item
  //       route = await crossChainProvider.getMintNFTRoute({
  //         ...baseRouteConfig,
  //         item: {
  //           collectionAddress: asset.contractAddress,
  //           itemId: asset.itemId,
  //           price: asset.price
  //         },
  //         toAmount: asset.price,
  //         toChain: asset.chainId
  //       })
  //     }

  //     if (route && !signal.aborted) {
  //       setRoute(route)
  //     }
  //   } catch (error) {
  //     console.error('Error while getting Route: ', error)
  //     analytics.track(events.ERROR_GETTING_ROUTE, {
  //       error,
  //       selectedToken,
  //       selectedChain
  //     })
  //     setRouteFailed(true)
  //   } finally {
  //     setIsFetchingRoute(false)
  //   }
  // }, [
  //   analytics,
  //   asset,
  //   crossChainProvider,
  //   destinyChainMANA,
  //   order,
  //   price,
  //   providerTokens,
  //   selectedChain,
  //   selectedToken,
  //   wallet
  // ])

  // when providerTokens are loaded and there's no selected token or the token selected if from another network
  useEffect(() => {
    if (
      crossChainProvider?.isLibInitialized() &&
      ((!selectedToken && providerTokens.length) || // only run if not selectedToken, meaning the first render
        (selectedToken && selectedChain.toString() !== selectedToken.chainId)) // or if selectedToken is not from the selectedChain
    ) {
      const MANAToken = providerTokens.find(
        t => t.symbol === 'MANA' && selectedChain.toString() === t.chainId
      )
      setSelectedToken(MANAToken || getMANAToken(selectedChain)) // if it's not in the providerTokens, create the object manually with the right conectract address
    }
  }, [
    // calculateRoute,
    crossChainProvider,
    providerTokens,
    selectedChain,
    selectedToken
  ])

  // computes if the user can buy the item with the selected token
  useEffect(() => {
    ;(async () => {
      if (
        selectedToken &&
        ((selectedToken.symbol === 'MANA' && !!wallet) ||
          (selectedToken.symbol !== 'MANA' && // MANA balance is calculated differently
            selectedTokenBalance))
      ) {
        let canBuy
        if (selectedToken.symbol === 'MANA' && wallet) {
          // wants to buy a L2 item with ETH MANA (through the provider)
          if (
            asset.network === Network.MATIC &&
            getNetwork(selectedChain) === Network.ETHEREUM
          ) {
            // TODO: Asset network as prop
            canBuy =
              wallet.networks[Network.ETHEREUM].mana >=
              +ethers.utils.formatEther(price)
          } else {
            canBuy =
              wallet.networks[asset.network].mana >=
              +ethers.utils.formatEther(price)
          }
        } else if (selectedTokenBalance && routeFeeCost) {
          const balance = parseFloat(
            ethers.utils.formatUnits(
              selectedTokenBalance,
              selectedToken.decimals
            )
          )
          const destinyChainMANA = getContract(
            ContractName.MANAToken,
            asset.chainId
          ).address

          const providerMANA = providerTokens.find(
            t =>
              t.address.toLocaleLowerCase() ===
              destinyChainMANA.toLocaleLowerCase()
          )
          if (providerMANA && selectedToken && crossChainProvider && wallet) {
            // fee is paid with same token selected
            if (selectedToken.symbol === routeFeeCost.token.symbol) {
              canBuy =
                balance > Number(fromAmount) + Number(routeFeeCost.totalCost)
            } else {
              const networkProvider = await getNetworkProvider(
                Number(routeFeeCost.token.chainId)
              )
              const provider = new ethers.providers.Web3Provider(
                networkProvider
              )
              const balanceNativeTokenWei = await provider.getBalance(
                wallet.address
              )
              const canPayForGas = balanceNativeTokenWei.gte(
                ethers.utils.parseEther(routeFeeCost.totalCost)
              )
              canBuy = canPayForGas && balance > Number(fromAmount)
            }
          }
        }
        setCanBuyItem(canBuy)
      }
    })()
  }, [
    asset,
    crossChainProvider,
    fromAmount,
    order,
    price,
    providerTokens,
    routeFeeCost,
    selectedChain,
    selectedToken,
    selectedTokenBalance,
    wallet
  ])

  // TODO: Remove
  // sets interval to refresh route within a certain amount of time
  // useEffect(() => {
  //   let interval: NodeJS.Timeout | undefined = undefined
  //   if (route) {
  //     // setRouteSetInterval(
  //     interval = setInterval(() => {
  //       setIsFetchingRoute(true)
  //       calculateRoute()
  //     }, ROUTE_FETCH_INTERVAL)
  //     // )
  //   }
  //   return () => {
  //     if (interval) {
  //       clearInterval(interval)
  //     }
  //   }
  // }, [calculateRoute, route])

  // TODO: This kind of needs to be removed, refactored or moved to the route fetching hook
  // when changing the selectedToken and it's not fetching route, trigger fetch route
  useEffect(() => {
    if (
      selectedToken &&
      !route &&
      !isFetchingRoute &&
      !useMetaTx &&
      !routeFailed
    ) {
      const isBuyingL1WithOtherTokenThanEthereumMANA =
        asset.chainId === ChainId.ETHEREUM_MAINNET &&
        selectedToken.chainId !== ChainId.ETHEREUM_MAINNET.toString() &&
        selectedToken.symbol !== 'MANA'

      const isPayingWithOtherTokenThanMANA = selectedToken.symbol !== 'MANA'
      const isPayingWithMANAButFromOtherChain =
        selectedToken.symbol === 'MANA' &&
        selectedToken.chainId !== asset.chainId.toString()

      if (
        isBuyingL1WithOtherTokenThanEthereumMANA ||
        isPayingWithOtherTokenThanMANA ||
        isPayingWithMANAButFromOtherChain
      ) {
        setIsFetchingRoute(true)
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
    asset.chainId,
    calculateRoute
  ])

  const onBuyWithCrypto = useCallback(async () => {
    if (route && crossChainProvider && crossChainProvider.isLibInitialized()) {
      onBuyItemThroughProvider(route)
    }
  }, [crossChainProvider, onBuyItemThroughProvider, route])

  const renderSwitchNetworkButton = useCallback(() => {
    return (
      <Button
        fluid
        inverted
        className={styles.switchNetworkButton}
        disabled={isSwitchingNetwork}
        data-testid={SWITCH_NETWORK_BUTTON_TEST_ID}
        onClick={() => onSwitchNetwork(selectedChain)}
      >
        {isSwitchingNetwork ? (
          <>
            <Loader inline active size="tiny" />
            {t('buy_with_crypto_modal.confirm_switch_network')}
          </>
        ) : (
          t('buy_with_crypto_modal.switch_network', {
            chain: providerChains.find(
              c => c.chainId === selectedChain.toString()
            )?.networkName
          })
        )}
      </Button>
    )
  }, [isSwitchingNetwork, onSwitchNetwork, providerChains, selectedChain])

  // TODO: move to its respective HOC (natively buy)
  // const onBuyNFT = useCallback(() => {
  //   if (order) {
  //     const contractNames = getContractNames()

  //     const mana = getContractProp({
  //       name: contractNames.MANA,
  //       network: asset.network
  //     }) as DCLContract

  //     const marketplace = getContractProp({
  //       address: order?.marketplaceAddress,
  //       network: asset.network
  //     }) as DCLContract

  //     onAuthorizedAction({
  //       targetContractName: ContractName.MANAToken,
  //       authorizationType: AuthorizationType.ALLOWANCE,
  //       authorizedAddress: order.marketplaceAddress,
  //       targetContract: mana as Contract,
  //       authorizedContractLabel: marketplace.label || marketplace.name,
  //       requiredAllowanceInWei: order.price,
  //       onAuthorized: alreadyAuthorized =>
  //         onExecuteOrder(order, asset as NFT, undefined, !alreadyAuthorized) // undefined as fingerprint
  //     })
  //   }
  // }, [asset, order, getContractProp, onAuthorizedAction, onExecuteOrder])

  // TODO: move to its respective HOC (natively buy)
  // const onBuyItem = useCallback(() => {
  //   if (!isNFT(asset)) {
  //     const contractNames = getContractNames()

  //     const mana = getContractProp({
  //       name: contractNames.MANA,
  //       network: asset.network
  //     }) as DCLContract

  //     const collectionStore = getContractProp({
  //       name: contractNames.COLLECTION_STORE,
  //       network: asset.network
  //     }) as DCLContract

  //     onAuthorizedAction({
  //       targetContractName: ContractName.MANAToken,
  //       authorizationType: AuthorizationType.ALLOWANCE,
  //       authorizedAddress: collectionStore.address,
  //       targetContract: mana as Contract,
  //       authorizedContractLabel: collectionStore.label || collectionStore.name,
  //       requiredAllowanceInWei: asset.price,
  //       onAuthorized: () => onBuyItemProp(asset)
  //     })
  //   }
  // }, [asset, getContractProp, onAuthorizedAction, onBuyItemProp])

  // TODO: This is the method that replaces the one below
  const handleBuyWithCard = useCallback(() => {
    analytics.track(events.CLICK_BUY_NFT_WITH_CARD)
    onBuyWithCard()
  }, [onBuyWithCard])

  // const onBuyWithCard = useCallback(() => {
  //   analytics.track(events.CLICK_BUY_NFT_WITH_CARD)
  //   return !isNFT(asset)
  //     ? onBuyItemWithCard(asset)
  //     : !!order
  //     ? onExecuteOrderWithCard(asset)
  //     : () => {}
  // }, [analytics, asset, onBuyItemWithCard, onExecuteOrderWithCard, order])

  // TODO: Extract to GetMANAButton
  const renderGetMANAButton = useCallback(() => {
    return (
      <>
        <Button
          fluid
          primary
          data-testid={GET_MANA_BUTTON_TEST_ID}
          loading={isFetchingBalance || isLoading}
          onClick={() => {
            onGetMana()
            onClose()
          }}
        >
          {t('buy_with_crypto_modal.get_mana')}
        </Button>
        <ChainButton
          inverted
          fluid
          chainId={asset.chainId}
          data-testid={BUY_WITH_CARD_TEST_ID}
          disabled={isLoading || isLoadingAuthorization}
          loading={isLoading || isLoadingAuthorization}
          onClick={handleBuyWithCard}
        >
          <Icon name="credit card outline" />
          {t(`buy_with_crypto_modal.buy_with_card`)}
        </ChainButton>
      </>
    )
  }, [
    isFetchingBalance,
    isLoading,
    asset.chainId,
    isLoadingAuthorization,
    handleBuyWithCard,
    onGetMana,
    onClose
  ])

  // TODO BuyNowButton
  const renderBuyNowButton = useCallback(() => {
    let onClick =
      selectedToken?.symbol === 'MANA' && !route
        ? !!order
          ? onBuyNFT
          : onBuyItem
        : onBuyWithCrypto

    return (
      <>
        <Button
          fluid
          primary
          data-testid={BUY_NOW_BUTTON_TEST_ID}
          disabled={
            (selectedToken?.symbol !== 'MANA' && !route) ||
            isFetchingRoute ||
            isLoadingBuyCrossChain
          }
          loading={isFetchingBalance || isLoading}
          onClick={onClick}
        >
          <>
            {isLoadingBuyCrossChain || isFetchingRoute ? (
              <Loader inline active size="tiny" />
            ) : null}
            {!isFetchingRoute // if fetching route, just render the Loader
              ? isLoadingBuyCrossChain
                ? t('buy_with_crypto_modal.confirm_transaction')
                : t('buy_with_crypto_modal.buy_now')
              : null}
          </>
        </Button>
      </>
    )
  }, [
    route,
    order,
    selectedToken,
    isFetchingRoute,
    isLoadingBuyCrossChain,
    isFetchingBalance,
    isLoading,
    onBuyNFT,
    onBuyItem,
    onBuyWithCrypto
  ])

  // TODO: This needs to be refactored
  // TODO: Move to BuyButton component
  const renderMainActionButton = useCallback(() => {
    if (wallet && selectedToken && canBuyItem !== undefined) {
      if (canBuyItem) {
        // it's paying with MANA but connected on Ethereum
        if (
          selectedToken.symbol === 'MANA' &&
          wallet.network === Network.ETHEREUM
        ) {
          return asset.network === Network.ETHEREUM // if it's buying a L1 NFT, render buy now
            ? renderBuyNowButton()
            : isPriceTooLow(price) // if it's too low for a meta tx, render switch button
            ? renderSwitchNetworkButton()
            : renderBuyNowButton() // else, buy button
        }
        // for any other token, it needs to be connected on the selectedChain network
        return selectedChain === wallet.chainId
          ? renderBuyNowButton()
          : renderSwitchNetworkButton()
      } else {
        // can't buy Get Mana and Buy With Card buttons
        return renderGetMANAButton()
      }
    } else if (!route && routeFailed) {
      // can't buy Get Mana and Buy With Card buttons
      return renderGetMANAButton()
    }
  }, [
    wallet,
    selectedToken,
    canBuyItem,
    route,
    asset,
    price,
    routeFailed,
    selectedChain,
    renderBuyNowButton,
    renderSwitchNetworkButton,
    renderGetMANAButton
  ])

  // TODO: Remains here
  const onTokenOrChainSelection = useCallback(
    (selectedOption: Token | ChainData) => {
      setShowChainSelector(false)
      setShowTokenSelector(false)

      if (isToken(selectedOption)) {
        abortControllerRef.current.abort()

        const selectedToken = providerTokens.find(
          t =>
            t.address === selectedOption.address &&
            t.chainId === selectedChain.toString()
        ) as Token
        // reset all fields
        setSelectedToken(selectedToken)
        setFromAmount(undefined)
        setCanBuyItem(undefined)
        // setRoute(undefined)
        // setRouteFailed(false)
        abortControllerRef.current = new AbortController()
        analytics.track(events.CROSS_CHAIN_TOKEN_SELECTION, {
          selectedToken
        })
      } else {
        setSelectedChain(Number(selectedOption.chainId) as ChainId)
        const manaDestinyChain = providerTokens.find(
          t => t.symbol === 'MANA' && t.chainId === selectedOption.chainId
        )
        // set the selected token on the new chain selected to MANA or the first one found
        const selectedToken = providerTokens.find(
          t => t.chainId === selectedOption.chainId
        )
        const token = manaDestinyChain || selectedToken
        if (token) {
          setSelectedToken(token)
        }
        // setRoute(undefined)
        // setRouteFailed(false)

        analytics.track(events.CROSS_CHAIN_CHAIN_SELECTION, {
          selectedChain: selectedOption.chainId
        })
      }
    },
    [analytics, providerTokens, selectedChain]
  )

  // TODO: Remains here
  const renderModalNavigation = useCallback(() => {
    if (showChainSelector || showTokenSelector) {
      return (
        <ModalNavigation
          title={t(
            `buy_with_crypto_modal.token_and_chain_selector.select_${
              showChainSelector ? 'chain' : 'token'
            }`
          )}
          onBack={() => {
            setShowChainSelector(false)
            setShowTokenSelector(false)
          }}
        />
      )
    }
    return (
      <ModalNavigation
        title={t('buy_with_crypto_modal.title', {
          name: asset.name,
          b: (children: React.ReactChildren) => <b>{children}</b>
        })}
        onClose={onClose}
      />
    )
  }, [asset.name, onClose, showChainSelector, showTokenSelector])

  const translationPageDescriptorId = compact([
    'mint',
    isWearableOrEmote(asset)
      ? isBuyWithCardPage
        ? 'with_card'
        : 'with_mana'
      : null,
    'page'
  ]).join('_')

  const location = useLocation()
  const history = useHistory()

  const handleOnClose = useCallback(() => {
    const search = new URLSearchParams(location.search)
    const hasModalQueryParam = search.get('buyWithCrypto')
    if (hasModalQueryParam) {
      search.delete('buyWithCrypto')
      history.replace({
        search: search.toString()
      })
    }
    onClose()
  }, [history, location.search, onClose])

  const handleShowChainSelector = useCallback(() => {
    setShowChainSelector(true)
  }, [])

  const handleShowTokenSelector = useCallback(() => {
    setShowTokenSelector(true)
  }, [])

  return (
    <Modal
      size="tiny"
      onClose={handleOnClose}
      className={styles.buyWithCryptoModal}
    >
      {renderModalNavigation()}
      <Modal.Content>
        <>
          {showChainSelector || showTokenSelector ? (
            <div>
              {showChainSelector && wallet ? (
                <ChainAndTokenSelector
                  wallet={wallet}
                  currentChain={selectedChain}
                  chains={providerChains}
                  onSelect={onTokenOrChainSelection}
                />
              ) : null}
              {showTokenSelector && wallet ? (
                <ChainAndTokenSelector
                  wallet={wallet}
                  currentChain={selectedChain}
                  tokens={providerTokens}
                  onSelect={onTokenOrChainSelection}
                />
              ) : null}
            </div>
          ) : (
            <>
              <div className={styles.assetContainer}>
                <AssetImage asset={asset} isSmall />
                <span className={styles.assetName}>{asset.name}</span>
                <div className={styles.priceContainer}>
                  <Mana network={asset.network} inline withTooltip>
                    {formatWeiMANA(price)}
                  </Mana>
                  <span className={styles.priceInUSD}>
                    <ManaToFiat mana={price} digits={4} />
                  </span>
                </div>
              </div>

              <PaymentSelector
                price={price}
                wallet={wallet}
                providerTokens={providerTokens}
                selectedToken={selectedToken}
                selectedChain={selectedChain}
                shouldUseCrossChainProvider={shouldUseCrossChainProvider}
                gasCost={gasCost}
                isFetchingGasCost={isFetchingGasCost}
                isFetchingBalance={isFetchingBalance}
                selectedProviderChain={selectedProviderChain}
                selectedTokenBalance={selectedTokenBalance}
                onShowChainSelector={handleShowChainSelector}
                onShowTokenSelector={handleShowTokenSelector}
                amountInSelectedToken={fromAmount}
                route={route}
                routeFeeCost={routeFeeCost}
              />

              <PurchaseTotal
                selectedToken={selectedToken}
                price={price}
                useMetaTx={useMetaTx}
                shouldUseCrossChainProvider={shouldUseCrossChainProvider}
                route={route}
                routeFeeCost={routeFeeCost}
                fromAmount={fromAmount}
                isLoading={isFetchingRoute || isFetchingGasCost}
                gasCost={gasCost}
                providerTokens={providerTokens}
                routeTotalUSDCost={routeTotalUSDCost}
              />

              {selectedToken && shouldUseCrossChainProvider ? (
                <div className={styles.durationAndExchangeContainer}>
                  <div>
                    <span>
                      <Icon name="clock outline" />{' '}
                      {t(
                        'buy_with_crypto_modal.durations.transaction_duration'
                      )}{' '}
                    </span>
                    {route ? (
                      t(
                        `buy_with_crypto_modal.durations.${
                          route.route.estimate.estimatedRouteDuration === 0
                            ? 'fast'
                            : route.route.estimate.estimatedRouteDuration === 20
                            ? 'normal'
                            : 'slow'
                        }`
                      )
                    ) : (
                      <span
                        className={classNames(
                          styles.skeleton,
                          styles.fromAmountUSDSkeleton
                        )}
                      />
                    )}
                  </div>
                  <div className={styles.exchangeContainer}>
                    <div className={styles.exchangeContainerLabel}>
                      <span className={styles.exchangeIcon} />
                      <span> {t('buy_with_crypto_modal.exchange_rate')} </span>
                    </div>
                    {route && selectedToken ? (
                      <>
                        1 {selectedToken.symbol} ={' '}
                        {route.route.estimate.exchangeRate?.slice(0, 7)} MANA
                      </>
                    ) : (
                      <span
                        className={classNames(
                          styles.skeleton,
                          styles.fromAmountUSDSkeleton
                        )}
                      />
                    )}
                  </div>
                </div>
              ) : null}

              {selectedToken &&
              shouldUseCrossChainProvider &&
              asset.network === Network.MATIC && // and it's buying a MATIC wearable
              !isPriceTooLow(price) ? (
                <span className={styles.rememberFreeTxs}>
                  {t('buy_with_crypto_modal.remember_transaction_fee_covered', {
                    covered: (
                      <span className={styles.feeCoveredFree}>
                        {t('buy_with_crypto_modal.covered_for_you_by_dao')}
                      </span>
                    )
                  })}
                </span>
              ) : null}

              {hasLowPriceForMetaTx && !isBuyWithCardPage && useMetaTx ? (
                <span
                  className={styles.warning}
                  data-testid={PRICE_TOO_LOW_TEST_ID}
                >
                  {' '}
                  {t('buy_with_crypto_modal.price_too_low', {
                    learn_more: (
                      <a
                        href="https://docs.decentraland.org/player/blockchain-integration/transactions-in-polygon/#why-do-i-have-to-cover-the-tra[…]ems-that-cost-less-than-1-mana"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {/* TODO: add this URL */}
                        <u> {t('buy_with_crypto_modal.learn_more')} </u>
                      </a>
                    )
                  })}
                </span>
              ) : null}
              {/* TODO: Why is it checking if it's a wearable or a emote? */}
              {canBuyItem === false && isWearableOrEmote(asset) ? (
                <span className={styles.warning}>
                  {t('buy_with_crypto_modal.insufficient_funds', {
                    token: selectedToken?.symbol || 'MANA'
                  })}
                </span>
              ) : null}
              {routeFailed && selectedToken ? (
                <span className={styles.warning}>
                  {' '}
                  {t('buy_with_crypto_modal.route_unavailable', {
                    token: selectedToken.symbol
                  })}
                </span>
              ) : null}
            </>
          )}
        </>
      </Modal.Content>
      {showChainSelector || showTokenSelector ? null : (
        <Modal.Actions>
          <div
            className={classNames(
              styles.buttons,
              isWearableOrEmote(asset) && 'with-mana'
            )}
          >
            {renderMainActionButton()}
          </div>
          {isWearableOrEmote(asset) && isBuyWithCardPage ? (
            <CardPaymentsExplanation
              translationPageDescriptorId={translationPageDescriptorId}
            />
          ) : null}
        </Modal.Actions>
      )}
    </Modal>
  )
}

export const BuyNFTWithCryptoModal = React.memo(
  withAuthorizedAction(
    BuyWithCryptoModal,
    AuthorizedAction.BUY,
    {
      action: 'buy_with_mana_page.authorization.action',
      title_action: 'buy_with_mana_page.authorization.title_action'
    },
    getBuyItemStatus,
    getError
  )
)

export const MintNFTWithCryptoModal = React.memo(
  withAuthorizedAction(
    BuyWithCryptoModal,
    AuthorizedAction.MINT,
    {
      action: 'mint_with_mana_page.authorization.action',
      title_action: 'mint_with_mana_page.authorization.title_action'
    },
    getMintItemStatus,
    getError
  )
)
