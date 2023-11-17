import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import {
  getConnectedProvider,
  getNetworkProvider
} from 'decentraland-dapps/dist/lib/eth'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { Contract as DCLContract } from '../../../modules/vendor/services'
import { isNFT, isWearableOrEmote } from '../../../modules/asset/utils'
import { getContractNames } from '../../../modules/vendor'
import * as events from '../../../utils/events'
import { Mana } from '../../Mana'
import { formatWeiMANA } from '../../../lib/mana'
import {
  CROSS_CHAIN_SUPPORTED_CHAINS,
  ChainData,
  RouteResponse,
  Token,
  crossChainProvider
} from '../../../lib/xchain'
import { AssetImage } from '../../AssetImage'
import { isPriceTooLow } from '../../BuyPage/utils'
import { CardPaymentsExplanation } from '../../BuyPage/CardPaymentsExplanation'
import { ManaToFiat } from '../../ManaToFiat'
import { getBuyItemStatus, getError } from '../../../modules/order/selectors'
import { getMintItemStatus } from '../../../modules/item/selectors'
import { NFT } from '../../../modules/nft/types'
import ChainAndTokenSelector from './ChainAndTokenSelector/ChainAndTokenSelector'
import { getMANAToken, getShouldUseMetaTx, isToken } from './utils'
import { Props } from './BuyWithCryptoModal.types'
import styles from './BuyWithCryptoModal.module.css'

export const CANCEL_DATA_TEST_ID = 'confirm-buy-with-crypto-modal-cancel'
export const CONFIRM_DATA_TEST_ID = 'confirm-buy-with-crypto-modal-confirm'

const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const ROUTE_FETCH_INTERVAL = 10000000 // 10 secs

export type ProviderChain = ChainData
export type ProviderToken = Token

crossChainProvider.init()

const BuyWithCryptoModal = (props: Props) => {
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
    onBuyItem: onBuyItemProp,
    onBuyItemThroughProvider,
    onBuyItemWithCard,
    onExecuteOrder,
    onExecuteOrderWithCard,
    onGetMana,
    onClose
  } = props

  const analytics = getAnalytics()
  const destinyChainMANA = getContract(ContractName.MANAToken, asset.chainId)
    .address
  const abortControllerRef = useRef(new AbortController())

  // useStates
  const [providerChains, setProviderChains] = useState<ChainData[]>([])
  const [providerTokens, setProviderTokens] = useState<Token[]>([])
  const [selectedChain, setSelectedChain] = useState(asset.chainId)
  const [selectedToken, setSelectedToken] = useState<Token>()
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const [isFetchingRoute, setIsFetchingRoute] = useState(false)
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<BigNumber>()
  const [route, setRoute] = useState<RouteResponse>()
  const [routeFailed, setRouteFailed] = useState(false)
  const [canBuyItem, setCanBuyItem] = useState<boolean | undefined>(undefined)
  const [fromAmount, setFromAmount] = useState<string | undefined>(undefined)
  const [showChainSelector, setShowChainSelector] = useState(false)
  const [showTokenSelector, setShowTokenSelector] = useState(false)

  // useMemos

  // if the tx should be done through the provider
  const shouldUseCrossChainProvider = useMemo(
    () =>
      selectedToken &&
      !(
        (
          (selectedToken.symbol === 'MANA' &&
            getNetwork(selectedChain) === Network.MATIC &&
            asset.network === Network.MATIC) || // MANA selected and it's sending the tx from MATIC
          (selectedToken.symbol === 'MANA' &&
            getNetwork(selectedChain) === Network.ETHEREUM &&
            asset.network === Network.ETHEREUM)
        ) // MANA selected and it's connected to ETH and buying a L1 NFT
      ),
    [asset.network, selectedChain, selectedToken]
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
  const price = useMemo(
    () => (order ? order.price : !isNFT(asset) ? asset.price : ''),
    [asset, order]
  )

  // Compute if the price is too low for meta tx
  const hasLowPriceForMetaTx = useMemo(
    () => wallet?.chainId !== ChainId.MATIC_MAINNET && isPriceTooLow(price), // not connected to polygon AND has price < minimun for meta tx
    [price, wallet?.chainId]
  )

  // Compute the route fee cost
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
        gasCost: parseFloat(
          ethers.utils.formatUnits(
            totalGasCost,
            route.route.estimate.gasCosts[0].token.decimals
          )
        ).toFixed(6),
        feeCost: parseFloat(
          ethers.utils.formatUnits(
            totalFeeCost,
            route.route.estimate.gasCosts[0].token.decimals
          )
        ).toFixed(6),
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
    if (
      route &&
      routeFeeCost &&
      routeFeeCost.token.usdPrice &&
      fromAmount &&
      selectedToken?.usdPrice
    ) {
      const { feeCost, gasCost } = routeFeeCost
      return (
        routeFeeCost.token.usdPrice * (Number(gasCost) + Number(feeCost)) +
        selectedToken.usdPrice * Number(fromAmount)
      )
    }
  }, [fromAmount, route, routeFeeCost, selectedToken])

  // useEffects

  // init lib if necessary and fetch chains & supported tokens
  useEffect(() => {
    ;(async () => {
      if (crossChainProvider) {
        if (!crossChainProvider.isLibInitialized()) {
          await crossChainProvider.init()
        }
        setProviderChains(
          crossChainProvider
            .getSupportedChains()
            .filter(c => CROSS_CHAIN_SUPPORTED_CHAINS.includes(+c.chainId))
        )
        setProviderTokens(
          crossChainProvider
            .getSupportedTokens()
            .filter(t => CROSS_CHAIN_SUPPORTED_CHAINS.includes(+t.chainId))
        )
      }
    })()
  }, [wallet])

  // calculates Route for the selectedToken
  const calculateRoute = useCallback(async () => {
    const abortController = abortControllerRef.current
    const signal = abortController.signal

    const providerMANA = providerTokens.find(
      t =>
        t.address.toLocaleLowerCase() === destinyChainMANA.toLocaleLowerCase()
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
      let route: RouteResponse | undefined = undefined
      const fromAmountParams = {
        fromToken: selectedToken,
        toAmount: ethers.utils.formatEther(
          order
            ? order.price
            : !isNFT(asset) && +asset.price > 0
            ? asset.price
            : 1 //TODO: review this
        ),
        toToken: providerMANA
      }
      const fromAmount = Number(
        await crossChainProvider.getFromAmount(fromAmountParams)
      ).toFixed(6)
      setFromAmount(fromAmount)

      const fromAmountWei = ethers.utils
        .parseUnits(fromAmount.toString(), selectedToken.decimals)
        .toString()

      const baseRouteConfig = {
        fromAddress: wallet.address,
        fromAmount: fromAmountWei,
        fromChain: selectedChain,
        fromToken: selectedToken.address
      }

      if (order) {
        // there's an order so it's buying an NFT
        route = await crossChainProvider.getBuyNFTRoute({
          ...baseRouteConfig,
          nft: {
            collectionAddress: order.contractAddress,
            tokenId: order.tokenId,
            price: order.price
          },
          toAmount: order.price,
          toChain: order.chainId
        })
      } else if (!isNFT(asset)) {
        // buying an item
        route = await crossChainProvider.getMintNFTRoute({
          ...baseRouteConfig,
          item: {
            collectionAddress: asset.contractAddress,
            itemId: asset.itemId,
            price: asset.price
          },
          toAmount: asset.price,
          toChain: asset.chainId
        })
      }

      if (route && !signal.aborted) {
        setRoute(route)
      }
    } catch (error) {
      console.error('Error while getting Route: ', error)
      analytics.track(events.ERROR_GETTING_ROUTE, {
        error,
        selectedToken,
        selectedChain
      })
      setRouteFailed(true)
    } finally {
      setIsFetchingRoute(false)
    }
  }, [
    analytics,
    asset,
    destinyChainMANA,
    order,
    providerTokens,
    selectedChain,
    selectedToken,
    wallet
  ])

  // when providerTokens are loaded and there's no selected token or the token selected if from another network
  useEffect(() => {
    if (
      crossChainProvider.initialized &&
      ((!selectedToken && providerTokens.length) || // only run if not selectedToken, meaning the first render
        (selectedToken && selectedChain.toString() !== selectedToken.chainId)) // or if selectedToken is not from the selectedChain
    ) {
      const MANAToken = providerTokens.find(
        t => t.symbol === 'MANA' && selectedChain.toString() === t.chainId
      )

      setSelectedToken(MANAToken || getMANAToken(selectedChain)) // if it's not in the providerTokens, create the object manually with the right conectract address
    }
  }, [calculateRoute, providerTokens, selectedChain, selectedToken])

  // fetch selected token balance & price
  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setIsFetchingBalance(true)
        if (
          crossChainProvider &&
          crossChainProvider.isLibInitialized() &&
          selectedChain &&
          selectedToken &&
          selectedToken.symbol !== 'MANA' && // mana balance is already available in the wallet
          wallet
        ) {
          const networkProvider = await getNetworkProvider(selectedChain)
          const provider = new ethers.providers.Web3Provider(networkProvider)

          // if native token
          if (selectedToken.address === NATIVE_TOKEN) {
            const balanceWei = await provider.getBalance(wallet.address)
            setSelectedTokenBalance(balanceWei)

            return
          }
          // else ERC20
          const tokenContract = new ethers.Contract(
            selectedToken.address,
            ['function balanceOf(address owner) view returns (uint256)'],
            provider
          )
          const balance: BigNumber = await tokenContract.balanceOf(
            wallet.address
          )

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
  }, [selectedToken, selectedChain, wallet])

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
            canBuy =
              wallet.networks[Network.ETHEREUM].mana >=
              +ethers.utils.formatEther(price)
          } else {
            canBuy =
              wallet.networks[asset.network].mana >=
              +ethers.utils.formatEther(price)
          }
        } else if (selectedTokenBalance) {
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
          if (providerMANA && selectedToken) {
            const fromAmountParams = {
              fromToken: selectedToken,
              toAmount: ethers.utils.formatEther(price),
              toToken: providerMANA
            }
            const fromAmount = Number(
              await crossChainProvider.getFromAmount(fromAmountParams)
            ).toFixed(6)
            canBuy = balance > Number(fromAmount)
          }
        }
        console.log('bug canBuy: ', canBuy)
        setCanBuyItem(canBuy)
        // setCanBuyItem(balance > Number(fromAmount))
      }
    })()
  }, [
    asset,
    order,
    price,
    providerTokens,
    selectedChain,
    selectedToken,
    selectedTokenBalance,
    wallet
  ])

  // sets interval to refresh route within a certain amount of time
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined
    if (route) {
      // setRouteSetInterval(
      interval = setInterval(() => {
        setIsFetchingRoute(true)
        console.log('EXECUTING THE CALCULATE ROUTE FROM THE SET INTERVAL')
        console.log('calculate2')
        calculateRoute()
      }, ROUTE_FETCH_INTERVAL)
      // )
    }
    return () => {
      if (interval) {
        console.log('CLEARING INTERVAL')
        clearInterval(interval)
      }
    }
  }, [calculateRoute, route])

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
    calculateRoute,
    isFetchingRoute,
    route,
    routeFailed,
    selectedToken,
    useMetaTx,
    selectedChain,
    asset.chainId
  ])

  const onBuyWithCrypto = useCallback(async () => {
    const provider = await getConnectedProvider()
    if (
      route &&
      crossChainProvider &&
      crossChainProvider.isLibInitialized() &&
      provider
    ) {
      onBuyItemThroughProvider(route)
      // const axelarScanUrl = `https://axelarscan.io/gmp/${tx.transactionHash}`
    }
  }, [onBuyItemThroughProvider, route])

  // useCallbacks

  const renderSwitchNetworkButton = useCallback(() => {
    return (
      <Button
        fluid
        primary
        className={styles.switchNetworkButton}
        disabled={isSwitchingNetwork}
        data-testid={CONFIRM_DATA_TEST_ID}
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

  const onBuyNFT = useCallback(() => {
    if (order) {
      const contractNames = getContractNames()

      const mana = getContractProp({
        name: contractNames.MANA,
        network: asset.network
      }) as DCLContract

      const marketplace = getContractProp({
        address: order?.marketplaceAddress,
        network: asset.network
      }) as DCLContract

      onAuthorizedAction({
        targetContractName: ContractName.MANAToken,
        authorizationType: AuthorizationType.ALLOWANCE,
        authorizedAddress: order.marketplaceAddress,
        targetContract: mana as Contract,
        authorizedContractLabel: marketplace.label || marketplace.name,
        requiredAllowanceInWei: order.price,
        onAuthorized: alreadyAuthorized =>
          onExecuteOrder(order, asset as NFT, undefined, !alreadyAuthorized) // undefined as fingerprint
      })
    }
  }, [asset, order, getContractProp, onAuthorizedAction, onExecuteOrder])

  const onBuyItem = useCallback(() => {
    if (!isNFT(asset)) {
      const contractNames = getContractNames()

      const mana = getContractProp({
        name: contractNames.MANA,
        network: asset.network
      }) as DCLContract

      const collectionStore = getContractProp({
        name: contractNames.COLLECTION_STORE,
        network: asset.network
      }) as DCLContract

      onAuthorizedAction({
        targetContractName: ContractName.MANAToken,
        authorizationType: AuthorizationType.ALLOWANCE,
        authorizedAddress: collectionStore.address,
        targetContract: mana as Contract,
        authorizedContractLabel: collectionStore.label || collectionStore.name,
        requiredAllowanceInWei: asset.price,
        onAuthorized: () => onBuyItemProp(asset)
      })
    }
  }, [asset, getContractProp, onAuthorizedAction, onBuyItemProp])

  const onBuyWithCard = useCallback(() => {
    analytics.track(events.CLICK_BUY_NFT_WITH_CARD)
    return !isNFT(asset)
      ? onBuyItemWithCard(asset)
      : !!order
      ? onExecuteOrderWithCard(asset)
      : () => {}
  }, [analytics, asset, onBuyItemWithCard, onExecuteOrderWithCard, order])

  const renderGetMANAButton = useCallback(() => {
    return (
      <>
        <Button
          fluid
          primary
          data-testid={CONFIRM_DATA_TEST_ID}
          loading={isFetchingBalance || isLoading}
          onClick={() => onGetMana()}
        >
          {t('buy_with_crypto_modal.get_mana')}
        </Button>
        <ChainButton
          inverted
          fluid
          disabled={isLoading || isLoadingAuthorization}
          onClick={onBuyWithCard}
          loading={isLoading || isLoadingAuthorization}
          chainId={asset.chainId}
        >
          <Icon name="credit card outline" />
          {t(`buy_with_crypto_modal.buy_with_card`)}
        </ChainButton>
      </>
    )
  }, [
    isFetchingBalance,
    isLoading,
    isLoadingAuthorization,
    asset.chainId,
    onBuyWithCard,
    onGetMana
  ])

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
          data-testid={CONFIRM_DATA_TEST_ID}
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

  const renderMainActionButton = useCallback(() => {
    if (wallet && selectedToken && canBuyItem !== undefined) {
      if (canBuyItem) {
        if (
          selectedToken.symbol === 'MANA' &&
          wallet.network === Network.ETHEREUM
        ) {
          return isPriceTooLow(price)
            ? renderSwitchNetworkButton()
            : renderBuyNowButton()
        }
        // for any other token, it needs to be connected on the selectedChain network
        return selectedChain === wallet.chainId
          ? renderBuyNowButton()
          : renderSwitchNetworkButton()
      } else {
        console.log('rendering get mana button')
        // can't buy Get Mana and Buy With Card buttons
        return renderGetMANAButton()
      }
    }
  }, [
    price,
    wallet,
    selectedToken,
    canBuyItem,
    selectedChain,
    renderBuyNowButton,
    renderSwitchNetworkButton,
    renderGetMANAButton
  ])

  const renderTokenBalance = useCallback(() => {
    let balance
    if (selectedToken && selectedToken.symbol === 'MANA') {
      balance = wallet?.networks[getNetwork(selectedChain)]?.mana.toFixed(2)
    } else if (selectedToken && selectedTokenBalance) {
      balance = Number(
        ethers.utils.formatUnits(selectedTokenBalance, selectedToken.decimals)
      ).toFixed(4)
    }

    return !isFetchingBalance ? (
      <span className={styles.balance}>{balance}</span>
    ) : (
      <div className={styles.balanceSkeleton} />
    )
  }, [
    wallet,
    isFetchingBalance,
    selectedChain,
    selectedToken,
    selectedTokenBalance
  ])

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
        setSelectedTokenBalance(undefined)
        setCanBuyItem(undefined)
        setRoute(undefined)
        setRouteFailed(false)
        abortControllerRef.current = new AbortController()
      } else {
        setSelectedChain(Number(selectedOption.chainId) as ChainId)
        const manaDestinyChain = providerTokens.find(
          t => t.symbol === 'MANA' && t.chainId === selectedOption.chainId
        )
        // set the selected token on the new chain selected to MANA or the first one found
        setSelectedToken(
          manaDestinyChain ||
            providerTokens.find(t => t.chainId === selectedOption.chainId)
        )
        setRoute(undefined)
        setRouteFailed(false)
      }
    },
    [providerTokens, selectedChain]
  )

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

  return (
    <Modal size="tiny" onClose={onClose} className={styles.buyWithCryptoModal}>
      {renderModalNavigation()}
      <Modal.Content>
        <>
          {showChainSelector || showTokenSelector ? (
            <div>
              {showChainSelector ? (
                <ChainAndTokenSelector
                  currentChain={selectedChain}
                  chains={providerChains}
                  onSelect={onTokenOrChainSelection}
                />
              ) : null}
              {showTokenSelector ? (
                <ChainAndTokenSelector
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

              {!providerTokens.length || !selectedToken ? (
                <Loader active className={styles.mainLoader} />
              ) : (
                <div className={styles.payWithContainer}>
                  <div className={styles.dropdownContainer}>
                    <div>
                      <span>{t('buy_with_crypto_modal.pay_with')}</span>
                      <div
                        className={styles.tokenAndChainSelector}
                        onClick={() => setShowChainSelector(true)}
                      >
                        <img
                          src={selectedProviderChain?.nativeCurrency.icon}
                          alt={selectedProviderChain?.nativeCurrency.name}
                        />
                        <span className={styles.tokenAndChainSelectorName}>
                          {' '}
                          {selectedProviderChain?.networkName}{' '}
                        </span>
                        <Icon name="chevron down" />
                      </div>
                    </div>
                    <div className={styles.tokenDropdownContainer}>
                      <div
                        className={classNames(
                          styles.tokenAndChainSelector,
                          styles.tokenDropdown
                        )}
                        onClick={() => setShowTokenSelector(true)}
                      >
                        <img
                          src={selectedToken.logoURI}
                          alt={selectedToken.name}
                        />
                        <span className={styles.tokenAndChainSelectorName}>
                          {selectedToken.symbol}{' '}
                        </span>
                        <div className={styles.balanceContainer}>
                          {t('buy_with_crypto_modal.balance')}:{' '}
                          {renderTokenBalance()}
                        </div>
                        <Icon name="chevron down" />
                      </div>
                    </div>
                  </div>
                  <div className={styles.costContainer}>
                    {!!selectedToken ? (
                      <>
                        <div className={styles.itemCost}>
                          <>
                            <div className={styles.itemCostLabels}>
                              {t('buy_with_crypto_modal.item_cost')}
                            </div>
                            <div className={styles.fromAmountContainer}>
                              <div className={styles.fromAmountTokenContainer}>
                                <img
                                  src={selectedToken?.logoURI}
                                  alt={selectedToken?.name}
                                />
                                {selectedToken.symbol === 'MANA' ? (
                                  ethers.utils.formatEther(price)
                                ) : !!fromAmount ? (
                                  fromAmount
                                ) : (
                                  <span
                                    className={classNames(
                                      styles.skeleton,
                                      styles.estimatedFeeSkeleton
                                    )}
                                  />
                                )}
                              </div>
                              {selectedToken.usdPrice ? (
                                fromAmount ||
                                selectedToken.symbol === 'MANA' ? (
                                  <span className={styles.fromAmountUSD}>
                                    ≈{' '}
                                    {!!route ? (
                                      <>
                                        $
                                        {(
                                          Number(fromAmount) *
                                          selectedToken.usdPrice
                                        ).toFixed(4)}
                                      </>
                                    ) : (
                                      <ManaToFiat mana={price} digits={4} />
                                    )}
                                  </span>
                                ) : null
                              ) : null}
                            </div>
                          </>
                        </div>

                        {shouldUseCrossChainProvider ? (
                          <div className={styles.itemCost}>
                            {t('buy_with_crypto_modal.fee_cost')}
                            <div className={styles.fromAmountContainer}>
                              {!!route && routeFeeCost ? (
                                <div
                                  className={styles.fromAmountTokenContainer}
                                >
                                  <img
                                    src={
                                      route.route.estimate.gasCosts[0].token
                                        .logoURI
                                    }
                                    alt={
                                      route.route.estimate.gasCosts[0].token
                                        .name
                                    }
                                  />
                                  {routeFeeCost.totalCost}
                                </div>
                              ) : (
                                <div
                                  className={classNames(
                                    styles.skeleton,
                                    styles.estimatedFeeSkeleton
                                  )}
                                />
                              )}
                              {!!routeFeeCost && routeFeeCost.token.usdPrice ? (
                                <span className={styles.fromAmountUSD}>
                                  ≈ $
                                  {(
                                    (Number(routeFeeCost.feeCost) +
                                      Number(routeFeeCost.gasCost)) *
                                    routeFeeCost.token.usdPrice
                                  ).toFixed(4)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              )}
              <div className={styles.totalContainer}>
                <div>
                  <span className={styles.total}>
                    {t('buy_with_crypto_modal.total')}
                  </span>
                  {useMetaTx && !isPriceTooLow(price) ? (
                    <span className={styles.feeCovered}>
                      {t('buy_with_crypto_modal.transaction_fee_covered', {
                        free: (
                          <span className={styles.feeCoveredFree}>
                            {t('buy_with_crypto_modal.free')}
                          </span>
                        )
                      })}
                    </span>
                  ) : null}
                </div>
                <div className={styles.totalPrice}>
                  <div>
                    {!!selectedToken ? (
                      shouldUseCrossChainProvider ? (
                        !!route && routeFeeCost ? (
                          <>
                            <img
                              src={selectedToken?.logoURI}
                              alt={selectedToken?.name}
                            />
                            {routeFeeCost?.token.symbol !==
                            selectedToken.symbol ? (
                              <>
                                {fromAmount}
                                <span> + </span>
                                <img
                                  src={routeFeeCost.token.logoURI}
                                  alt={routeFeeCost.token.name}
                                />
                                {routeFeeCost.totalCost}
                              </>
                            ) : (
                              <>
                                {Number(fromAmount) +
                                  Number(routeFeeCost.totalCost)}
                              </>
                            )}
                          </>
                        ) : isFetchingRoute ? (
                          <span
                            className={classNames(
                              styles.skeleton,
                              styles.estimatedFeeSkeleton
                            )}
                          />
                        ) : null
                      ) : (
                        <>
                          <img
                            src={selectedToken?.logoURI}
                            alt={selectedToken?.name}
                          />
                          {ethers.utils.formatEther(price)}
                        </>
                      )
                    ) : null}
                  </div>
                  <div>
                    <span className={styles.fromAmountUSD}>
                      {shouldUseCrossChainProvider ? (
                        <>
                          {' '}
                          {!!route
                            ? `$${routeTotalUSDCost?.toFixed(6)}`
                            : null}{' '}
                        </>
                      ) : (
                        <ManaToFiat mana={price} digits={4} />
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {selectedToken && shouldUseCrossChainProvider ? (
                <div className={styles.durationAndExchangeContainer}>
                  <div>
                    <span>
                      {' '}
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
                  <div>
                    <span> {t('buy_with_crypto_modal.exchange_rate')} </span>
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
                    free: (
                      <span className={styles.feeCoveredFree}>
                        {t('buy_with_crypto_modal.free')}
                      </span>
                    )
                  })}
                </span>
              ) : null}

              {hasLowPriceForMetaTx && !isBuyWithCardPage && useMetaTx ? (
                <span className={styles.warning}>
                  {' '}
                  {t('buy_with_crypto_modal.price_too_low', {
                    learn_more: (
                      <a
                        href="https://docs.decentraland.org"
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
