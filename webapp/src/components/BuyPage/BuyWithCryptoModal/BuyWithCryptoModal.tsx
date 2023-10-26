import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import compact from 'lodash/compact'
import classNames from 'classnames'
import { Redirect, useLocation, Link } from 'react-router-dom'
import { ethers, BigNumber } from 'ethers'
import { ChainId, Contract } from '@dcl/schemas'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { Button, Dropdown, Header, Icon, Loader } from 'decentraland-ui'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { ContractName, getContract } from 'decentraland-transactions'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  getConnectedProvider,
  getNetworkProvider
} from 'decentraland-dapps/dist/lib/eth'
import {
  ChainButton,
  withAuthorizedAction
} from 'decentraland-dapps/dist/containers'
import { Contract as DCLContract } from '../../../modules/vendor/services'
import {
  getAssetName,
  isNFT,
  isWearableOrEmote
} from '../../../modules/asset/utils'
import { formatWeiMANA } from '../../../lib/mana'
import * as events from '../../../utils/events'
import { getContractNames } from '../../../modules/vendor'
import { getBuyItemStatus, getError } from '../../../modules/order/selectors'
import {
  SUPPORTED_CHAINS,
  crossChainProvider,
  ChainData,
  Token,
  RouteResponse
} from '../../../lib/xchain'
import { Mana } from '../../Mana'
import { locations } from '../../../modules/routing/locations'
import { AssetAction } from '../../AssetAction'
import { NotEnoughMana } from '../NotEnoughMana'
import { Price } from '../Price'
import { CardPaymentsExplanation } from '../CardPaymentsExplanation'
import { Props } from './BuyWithCryptoModal.types'
import styles from './BuyWithCryptoModal.module.css'
import RouteSummary from './RouteSummary/RouteSummary'
import { getShouldUseMetaTx } from './utils'
import { isPriceTooLow } from '../utils'
import { PriceTooLow } from '../PriceTooLow'

export const CANCEL_DATA_TEST_ID = 'confirm-buy-with-crypto-modal-cancel'
export const CONFIRM_DATA_TEST_ID = 'confirm-buy-with-crypto-modal-confirm'

const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const ROUTE_INTERVAL = 10000000 // 10 secs

const BuyWithCryptoModal = (props: Props) => {
  const {
    wallet,
    asset,
    order,
    getContract: getContractProp,
    isLoading,
    isLoadingAuthorization,
    isBuyWithCardPage,
    onAuthorizedAction,
    onSwitchNetwork,
    onBuyItem: onBuyItemProp,
    onBuyItemThroughProvider,
    onBuyItemWithCard,
    onExecuteOrder,
    onExecuteOrderWithCard
  } = props

  const analytics = getAnalytics()
  const abortControllerRef = useRef(new AbortController())
  const tokenDropdownRef = useRef(null)

  const [showTokenSelector, setShowTokenSelector] = useState(false)
  console.log('showTokenSelector: ', showTokenSelector)
  const [isBuying, setIsBuying] = useState(false)
  const [providerChains, setProviderChains] = useState<ChainData[]>([])
  const [providerTokens, setProviderTokens] = useState<Token[]>([])
  const [selectedChain, setSelectedChain] = useState(
    ChainId.MATIC_MAINNET
    // wallet?.chainId || ChainId.MATIC_MAINNET
  )
  const [selectedToken, setSelectedToken] = useState<Token>()
  console.log('selectedToken: ', selectedToken)
  const [isFetchingBalance, setIsFetchingBalance] = useState(false)
  const [isFetchingRoute, setIsFetchingRoute] = useState(false)
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<BigNumber>()
  console.log('selectedTokenBalance: ', selectedTokenBalance)
  const [route, setRoute] = useState<RouteResponse>()
  console.log('route: ', route)
  const [routeFailed, setRouteFailed] = useState(false)
  const [canBuyItem, setCanBuyItem] = useState<boolean | undefined>(undefined)
  console.log('canBuyItem: ', canBuyItem)

  const destinyChainMANA = getContract(ContractName.MANAToken, asset.chainId)
    .address

  const hasLowPrice = useMemo(() => {
    console.log('wallet?.chainId: ', wallet?.chainId)
    return (
      wallet?.chainId !== ChainId.MATIC_MAINNET && // not connected to polygon AND has price < minimun for meta tx
      isPriceTooLow(order ? order.price : !isNFT(asset) ? asset.price : '')
    )
  }, [asset, order, wallet?.chainId])
  console.log('hasLowPrice: ', hasLowPrice)

  // Compute if the process should use a meta tx
  const useMetaTx = useMemo(() => {
    return (
      !selectedToken ||
      (!!selectedToken &&
        getShouldUseMetaTx(
          asset,
          selectedChain,
          selectedToken.address,
          destinyChainMANA
        ))
    )
  }, [asset, destinyChainMANA, selectedChain, selectedToken])
  console.log('useMetaTx: ', useMetaTx)

  // If it will use a meta tx, check the balance
  useEffect(() => {
    if (useMetaTx && wallet?.networks) {
      const price = order
        ? +ethers.utils.formatEther(order.price)
        : !isNFT(asset)
        ? +ethers.utils.formatEther(asset.price)
        : 0
      const network = getNetwork(selectedChain)
      setCanBuyItem(wallet.networks[network].mana >= price)
    }
  }, [asset, order, selectedChain, useMetaTx, wallet])

  const calculateRoute = useCallback(async () => {
    // async (selectedToken: Token) => {
    const abortController = abortControllerRef.current
    const signal = abortController.signal
    const providerMANA = providerTokens.find(
      t =>
        t.address.toLocaleLowerCase() === destinyChainMANA.toLocaleLowerCase()
    )
    if (
      !crossChainProvider ||
      !crossChainProvider.squid.initialized ||
      !wallet ||
      !selectedToken ||
      !providerMANA
    ) {
      return
    }
    try {
      console.log('***** CALCULATING ROUTE FORR: ', selectedToken.symbol)
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
            : 1
        ),
        toToken: providerMANA
      }
      console.log('fromAmountParams: ', fromAmountParams)
      // const fromAmount = Number(
      //   await crossChainProvider.squid.getFromAmount(fromAmountParams)
      // )
      const fromAmount = Number(
        await crossChainProvider.squid.getFromAmount(fromAmountParams)
      ).toFixed(6)
      console.log('fromAmount: ', fromAmount)

      const fromAmountWei = ethers.utils
        .parseUnits(fromAmount.toString(), selectedToken.decimals)
        .toString()

      console.log('isNFT(asset): ', isNFT(asset))

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
      console.log('Error while getting Route: ', error)
      // TODO: track error
      setRouteFailed(true)
    } finally {
      setIsFetchingRoute(false)
    }
  }, [
    asset,
    destinyChainMANA,
    order,
    providerTokens,
    selectedChain,
    selectedToken,
    wallet
  ])

  // init squid if necessary and fetch chains & supported tokens
  useEffect(() => {
    ;(async () => {
      if (crossChainProvider) {
        if (!crossChainProvider.squid.initialized) {
          await crossChainProvider.squid.init()
        }
        const fromToken = crossChainProvider.squid.tokens.filter(t =>
          SUPPORTED_CHAINS.includes(+t.chainId)
        )
        const fromChain = crossChainProvider.squid.chains.filter(c =>
          SUPPORTED_CHAINS.includes(+c.chainId)
        )
        setProviderChains(fromChain)
        setProviderTokens(fromToken)
      }
    })()
  }, [wallet])

  // when providerTokens are loaded and there's no selected token or the token selected if from another network
  useEffect(() => {
    if (
      showTokenSelector &&
      ((!selectedToken && providerTokens.length) || // only run if not selectedToken, meaning the first render
        (selectedToken && selectedChain.toString() !== selectedToken.chainId)) // or if selectedToken is not from the selectedChain
    ) {
      setSelectedToken(providerTokens[0])
      // const MANAToken = providerTokens.find(
      //   t => t.symbol === 'MANA' && selectedChain.toString() === t.chainId
      // )
      // if (MANAToken) {
      //   setSelectedToken(MANAToken)
      //   if (selectedChain !== ChainId.MATIC_MAINNET) {
      //     console.log('calculate1')
      //     calculateRoute()
      //     // calculateRoute(MANAToken)
      //   }
      // }
    }
  }, [
    calculateRoute,
    providerTokens,
    selectedChain,
    selectedToken,
    showTokenSelector
  ])

  // const [timestamp, setTimestamp] = useState(Date.now())
  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     setTimestamp(Date.now())
  //   }, 10000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  // // Refresh the route every 30 secs to get the updated fee's
  // useEffect(() => {
  //   if (route && selectedToken && !isFetchingRoute) {
  //     calculateRoute(selectedToken)
  //   }
  // }, [timestamp, route, selectedToken, calculateRoute, isFetchingRoute])

  // fetch selected token balance & price
  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        // setIsLoading(prevState => ({ ...prevState, balance: true }))
        setIsFetchingBalance(true)
        if (
          crossChainProvider.squid &&
          crossChainProvider.squid.initialized &&
          selectedChain &&
          selectedToken &&
          wallet
        ) {
          const networkProvider = await getNetworkProvider(selectedChain)
          const provider = new ethers.providers.Web3Provider(networkProvider)
          // const fromAmount = await squid.getFromAmount({
          //   fromToken: selectedToken,
          //   toAmount: ,
          //   toToken,
          //   slippagePercentage: 0.5
          // })
          // // const selectedTokenPrice = await squid.getTokenPrice({
          // //   tokenAddress: selectedToken.address,
          // //   chainId: selectedToken.chainId
          // // })

          // if (!cancel) {
          //   setSelectedTokenPrice(selectedTokenPrice)
          // }

          // if native token
          if (selectedToken.address === NATIVE_TOKEN) {
            const balanceWei = await provider.getBalance(wallet.address)
            const balanceEther = ethers.utils.formatEther(balanceWei)
            setSelectedTokenBalance(balanceWei)
            console.log(`Balance of ${wallet.address} is ${balanceEther} ETH`)

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
          // setIsLoading(prevState => ({ ...prevState, balance: false }))
          setIsFetchingBalance(false)
        }
      }
    })()
    return () => {
      cancel = true
    }
  }, [selectedToken, selectedChain, wallet])

  // Check if user can buy item
  useEffect(() => {
    ;(async () => {
      if (
        showTokenSelector && // added
        crossChainProvider.squid &&
        crossChainProvider.squid.initialized &&
        selectedToken &&
        selectedTokenBalance
      ) {
        const balance = parseFloat(
          ethers.utils.formatUnits(selectedTokenBalance, selectedToken.decimals)
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
            toAmount: ethers.utils.formatEther(
              order ? order.price : !isNFT(asset) ? asset.price : ''
            ),
            toToken: providerMANA
          }
          const fromAmount = Number(
            await crossChainProvider.squid.getFromAmount(fromAmountParams)
          ).toFixed(6)

          console.log(
            'balance > Number(fromAmount): ',
            balance > Number(fromAmount)
          )
          setCanBuyItem(balance > Number(fromAmount))
        }
      }
    })()
  }, [
    asset,
    order,
    providerTokens,
    selectedToken,
    selectedTokenBalance,
    showTokenSelector
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
      }, ROUTE_INTERVAL)
      // )
    }
    return () => {
      if (interval) {
        console.log('CLEARING INTERVAL')
        clearInterval(interval)
      }
    }
  }, [calculateRoute, route])

  const onTokenDropdownChange = useCallback(
    (_, data) => {
      abortControllerRef.current.abort()
      // walk-around to remove focus from the dropdown component from semantic
      setTimeout(() => {
        ;(tokenDropdownRef.current as any).ref.current.firstElementChild.blur()
      }, 100)

      const selectedToken = providerTokens.find(
        t => t.address === data.value && t.chainId === selectedChain.toString()
      ) as Token
      setSelectedToken(selectedToken)
      setSelectedTokenBalance(undefined)
      setCanBuyItem(undefined)
      setRouteFailed(false)
      setRoute(undefined)
      abortControllerRef.current = new AbortController()
      // calculateRoute()
    },
    [providerTokens, selectedChain]
    // [c/alculateRoute, providerTokens, selectedChain]
  )

  // when changing the selectedToken and it's not fetching route, trigger fetch route
  useEffect(() => {
    console.log('isFetchingRoute inside useEffect: ', isFetchingRoute)
    if (
      selectedToken &&
      !route &&
      !isFetchingRoute &&
      !useMetaTx &&
      !routeFailed &&
      (selectedToken.symbol !== 'MANA' ||
        (selectedToken.symbol === 'MANA' &&
          selectedChain !== ChainId.MATIC_MAINNET))
    ) {
      console.log('triggering ')
      setIsFetchingRoute(true)
      console.log('calculate3')
      calculateRoute()
    }
  }, [
    calculateRoute,
    isFetchingRoute,
    route,
    routeFailed,
    selectedToken,
    useMetaTx,
    selectedChain
  ])

  const onBuyWithCrypto = useCallback(async () => {
    const provider = await getConnectedProvider()
    if (
      route &&
      crossChainProvider.squid &&
      crossChainProvider.squid.initialized &&
      provider
    ) {
      onBuyItemThroughProvider(route)
      // const axelarScanUrl = `https://axelarscan.io/gmp/${tx.transactionHash}`
      // console.log('Follow your transaction here: ', axelarScanUrl)
      // setIsBuying(false)
    }
  }, [onBuyItemThroughProvider, route])

  const switchNetworkButton = useMemo(() => {
    return (
      <Button
        primary
        data-testid={CONFIRM_DATA_TEST_ID}
        onClick={() => onSwitchNetwork(selectedChain)}
      >
        {t('buy_with_crypto.switch_network', {
          chain: providerChains.find(
            c => c.chainId === selectedChain.toString()
          )?.networkName
        })}
      </Button>
    )
  }, [onSwitchNetwork, providerChains, selectedChain])

  const renderBuyWithCryptoButton = useCallback(() => {
    return (
      <Button
        primary
        data-testid={CONFIRM_DATA_TEST_ID}
        loading={isFetchingBalance || isBuying}
        disabled={!selectedToken || !canBuyItem || !route || isBuying} // TODO: OR INSUFFIENT BALANCE
        onClick={onBuyWithCrypto}
      >
        {!!selectedToken &&
        !!providerTokens.find(t => t.address === selectedToken.address)
          ? t('buy_with_crypto.buy_with_token', {
              token: providerTokens.find(
                t =>
                  t.address === selectedToken.address &&
                  t.chainId === selectedChain.toString()
              )?.symbol
            })
          : t('buy_with_crypto.select_a_token')}
      </Button>
    )
  }, [
    canBuyItem,
    isBuying,
    isFetchingBalance,
    providerTokens,
    route,
    selectedChain,
    selectedToken,
    onBuyWithCrypto
  ])

  const onBuyNFT = useCallback(() => {
    if (order && isNFT(asset)) {
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
          onExecuteOrder(order, asset, undefined, !alreadyAuthorized) // undefined as fingerprint
      })
    }
  }, [asset, order, getContractProp, onAuthorizedAction, onExecuteOrder])

  const onBuyItem = useCallback(() => {
    if (order && !isNFT(asset)) {
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
  }, [order, asset, getContractProp, onAuthorizedAction, onBuyItemProp])

  const { pathname, search } = useLocation()

  const isInsufficientMANA = useMemo(() => {
    return (
      !!wallet &&
      wallet.networks[asset.network].mana <
        +ethers.utils.formatEther(
          order ? order.price : !isNFT(asset) ? asset.price : ''
        )
    )
  }, [asset, order, wallet])
  console.log('isInsufficientMANA: ', isInsufficientMANA)

  const renderBuyWithMANAButton = useCallback(() => {
    if (!wallet) {
      return <Redirect to={locations.signIn(`${pathname}${search}`)} />
    }

    // const price = order
    //   ? +ethers.utils.formatEther(order.price)
    //   : !isNFT(asset)
    //   ? +ethers.utils.formatEther(asset.price)
    //   : 0

    // const isInsufficientMANA = wallet.networks[asset.network].mana < price

    return (
      <Button
        primary
        data-testid={CONFIRM_DATA_TEST_ID}
        loading={isFetchingBalance || isBuying}
        disabled={isInsufficientMANA}
        onClick={() => (isNFT(asset) ? onBuyNFT() : onBuyItem())}
      >
        {t('buy_with_crypto.buy_with_mana')}
      </Button>
    )
  }, [
    wallet,
    asset,
    isFetchingBalance,
    isBuying,
    isInsufficientMANA,
    pathname,
    search,
    onBuyNFT,
    onBuyItem
  ])

  const onBuyWithCard = useCallback(() => {
    if (isBuyWithCardPage) {
      analytics.track(events.CLICK_BUY_NFT_WITH_CARD)
      return isNFT(asset)
        ? onExecuteOrderWithCard(asset)
        : onBuyItemWithCard(asset)
    }
  }, [
    analytics,
    asset,
    isBuyWithCardPage,
    onBuyItemWithCard,
    onExecuteOrderWithCard
  ])

  const canBuyDirectlyWithMANA = useMemo(() => {
    return selectedToken
      ? selectedToken.symbol === 'MANA' &&
          selectedChain === asset.chainId &&
          !isInsufficientMANA
      : !isInsufficientMANA && !hasLowPrice
  }, [
    asset.chainId,
    hasLowPrice,
    isInsufficientMANA,
    selectedChain,
    selectedToken
  ])

  const renderConfirmButton = useCallback(() => {
    if (isBuyWithCardPage) {
      return (
        <ChainButton
          primary
          disabled={isLoading || isLoadingAuthorization}
          // disabled={isDisabled || isLoading || isLoadingAuthorization}
          onClick={onBuyWithCard}
          loading={isLoading || isLoadingAuthorization}
          chainId={asset.chainId}
        >
          {/* {isWearableOrEmote(nft) ? <Icon name="credit card outline" /> : null} */}
          <Icon name="credit card outline" />
          {t(`buy_with_crypto.buy_with_card`)}
        </ChainButton>
      )
    }

    // if it has MANA selected in the token selector
    if (showTokenSelector && !useMetaTx && selectedToken) {
      // connected on the same asset network
      // if (canBuyDirectlyWithMANA) {
      //   return renderBuyWithMANAButton()
      // }
      // offer to swtich network if MANA not selected
      if (
        selectedChain !== wallet?.chainId
        // &&
        // selectedToken.symbol !== 'MANA'
      ) {
        return switchNetworkButton
      }
    }

    const showBuyWithMANAButton = !isInsufficientMANA && !hasLowPrice
    console.log('showBuyWithMANAButton: ', showBuyWithMANAButton)
    return !showTokenSelector || useMetaTx || canBuyDirectlyWithMANA
      ? showBuyWithMANAButton
        ? renderBuyWithMANAButton()
        : null
      : renderBuyWithCryptoButton()
  }, [
    isBuyWithCardPage,
    showTokenSelector,
    useMetaTx,
    selectedToken,
    isInsufficientMANA,
    hasLowPrice,
    canBuyDirectlyWithMANA,
    renderBuyWithMANAButton,
    renderBuyWithCryptoButton,
    isLoading,
    isLoadingAuthorization,
    onBuyWithCard,
    asset.chainId,
    selectedChain,
    wallet?.chainId,
    switchNetworkButton
  ])

  const handleCancel = useCallback(() => {
    if (isBuyWithCardPage) analytics.track(events.CANCEL_BUY_NFT_WITH_CARD)
  }, [analytics, isBuyWithCardPage])

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
    <div className={styles.buyWithCryptoModal}>
      <AssetAction asset={asset}>
        <Header size="large">
          {t('buy_with_crypto.title', {
            name: asset.name,
            b: (children: React.ReactChildren) => <b>{children}</b>
          })}
        </Header>
        <>
          <div>
            <span className={styles.subtitle}>
              {t('buy_with_crypto.subtitle', {
                name: <b>{getAssetName(asset)}</b>,
                amount: (
                  <Mana network={asset.network} inline withTooltip>
                    {formatWeiMANA(
                      order ? order.price : !isNFT(asset) ? asset.price : ''
                    )}
                  </Mana>
                )
              })}
            </span>
          </div>

          {showTokenSelector ? (
            !providerTokens.length || !selectedToken ? (
              <Loader className={styles.mainLoader} active />
            ) : (
              <>
                {showTokenSelector ? (
                  <div className={styles.dropdownContainer}>
                    <div>
                      <span>{t('buy_with_crypto.choose_chain')}</span>
                      <Dropdown
                        className={classNames(styles.dcl_dropdown)}
                        value={selectedChain}
                        options={providerChains.map(chain => ({
                          text: chain.networkName,
                          value: +chain.chainId,
                          image: {
                            avatar: true,
                            src: chain.nativeCurrency.icon
                          }
                        }))}
                        onChange={(_, data) => {
                          setSelectedChain(data.value as any)
                          setRoute(undefined)
                        }}
                      />
                    </div>
                    <div className={styles.tokenDropdownContainer}>
                      <span>{t('buy_with_crypto.choose_token')}</span>
                      <Dropdown
                        ref={tokenDropdownRef}
                        className={classNames(
                          styles.dcl_dropdown,
                          styles.tokenDropdown
                        )}
                        search
                        scrolling
                        value={selectedToken?.address}
                        options={providerTokens
                          .filter(
                            token => token.chainId === selectedChain.toString()
                          )
                          .map(token => ({
                            text: token.symbol,
                            value: token.address,
                            image: { avatar: true, src: token.logoURI }
                          }))}
                        onChange={onTokenDropdownChange}
                      />
                      <div className={styles.balance_container}>
                        {t('buy_with_crypto.balance')}:{' '}
                        {selectedTokenBalance && !isFetchingBalance ? (
                          <span className={styles.balance}>
                            {ethers.utils
                              .formatUnits(
                                selectedTokenBalance,
                                selectedToken.decimals
                              )
                              .toString()
                              .slice(0, 6)}
                          </span>
                        ) : (
                          <div className={styles.balanceSkeleton} />
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
                {useMetaTx ||
                canBuyDirectlyWithMANA ||
                (selectedToken.symbol === 'MANA' &&
                  selectedChain === asset.chainId) ? null : (
                  <>
                    <RouteSummary route={route} selectedToken={selectedToken} />
                    {routeFailed && selectedToken ? (
                      <span className={styles.routeUnavailable}>
                        {' '}
                        {t('buy_with_crypto.route_unavailable', {
                          token: selectedToken.symbol
                        })}
                      </span>
                    ) : null}
                  </>
                )}
              </>
            )
          ) : null}

          {hasLowPrice && !isBuyWithCardPage && useMetaTx ? (
            <PriceTooLow
              chainId={asset.chainId}
              network={asset.network}
              onBuyWithAnotherToken={() => setShowTokenSelector(true)}
            />
          ) : null}
          {(canBuyItem === false || isInsufficientMANA) &&
          isWearableOrEmote(asset) ? (
            <NotEnoughMana
              asset={asset}
              onBuyWithAnotherToken={
                showTokenSelector ? undefined : () => setShowTokenSelector(true)
              }
              description={t('buy_with_crypto.not_enough_funds', {
                name: asset.name,
                network: (
                  <b>
                    {
                      providerChains.find(
                        chain => chain.chainId === selectedChain.toString()
                      )?.networkName
                    }
                  </b>
                ),
                token: <b>{selectedToken?.symbol || 'MANA'}</b>,
                amount: (
                  <Price
                    network={asset.network}
                    price={
                      order ? order.price : !isNFT(asset) ? asset.price : '0'
                    }
                  />
                )
              })}
            />
          ) : null}
        </>

        <div
          className={classNames(
            'buttons',
            isWearableOrEmote(asset) && 'with-mana'
          )}
        >
          <Button
            as={Link}
            to={
              isNFT(asset)
                ? locations.nft(asset.contractAddress, asset.tokenId)
                : locations.item(asset.contractAddress, asset.itemId)
            }
            data-testid={CANCEL_DATA_TEST_ID}
            onClick={handleCancel}
            disabled={isBuying}
          >
            {t('global.cancel')}
          </Button>
          {renderConfirmButton()}
        </div>
        {isWearableOrEmote(asset) && isBuyWithCardPage ? (
          <CardPaymentsExplanation
            translationPageDescriptorId={translationPageDescriptorId}
          />
        ) : null}
      </AssetAction>
    </div>
  )
}

export default React.memo(
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
