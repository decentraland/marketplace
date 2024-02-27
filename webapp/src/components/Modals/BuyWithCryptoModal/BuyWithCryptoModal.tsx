import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import compact from 'lodash/compact'
import { ethers } from 'ethers'
import { ChainId, Network } from '@dcl/schemas'
import { getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { Button, Icon, Loader, ModalNavigation } from 'decentraland-ui'
import { ContractName, getContract } from 'decentraland-transactions'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { isWearableOrEmote } from '../../../modules/asset/utils'
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
import { useShouldUseCrossChainProvider, useTokenBalance } from './hooks'
import PaymentSelector from './PaymentSelector/PaymentSelector'
import PurchaseTotal from './PurchaseTotal/PurchaseTotal'

export const CANCEL_DATA_TEST_ID = 'confirm-buy-with-crypto-modal-cancel'
export const BUY_NOW_BUTTON_TEST_ID = 'buy-now-button'
export const SWITCH_NETWORK_BUTTON_TEST_ID = 'switch-network'
export const GET_MANA_BUTTON_TEST_ID = 'get-mana-button'
export const BUY_WITH_CARD_TEST_ID = 'buy-with-card-button'
export const PRICE_TOO_LOW_TEST_ID = 'price-too-low-label'

export type ProviderChain = ChainData
export type ProviderToken = Token

const squidURL = config.get('SQUID_API_URL')

export const BuyWithCryptoModal = (props: Props) => {
  const {
    price,
    wallet,
    metadata: { asset },
    isLoading,
    isBuyingCrossChain,
    isLoadingAuthorization,
    isSwitchingNetwork,
    isBuyWithCardPage,
    onSwitchNetwork,
    onGetGasCost,
    onGetCrossChainRoute,
    onBuyNatively,
    onBuyWithCard,
    onBuyCrossChain,
    onGetMana,
    onClose,
    onGoBack
  } = props

  const analytics = getAnalytics()
  const manaAddressOnAssetChain = getContract(
    ContractName.MANAToken,
    asset.chainId
  ).address
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
  const [canBuyAsset, setCanBuyAsset] = useState<boolean | undefined>()
  const [insufficientToken, setInsufficientToken] = useState<
    Token | undefined
  >()
  const [showChainSelector, setShowChainSelector] = useState(false)
  const [showTokenSelector, setShowTokenSelector] = useState(false)
  const [crossChainProvider, setCrossChainProvider] = useState<
    CrossChainProvider
  >()
  const manaTokenOnSelectedChain: Token | undefined = useMemo(() => {
    return providerTokens.find(
      t => t.symbol === 'MANA' && t.chainId === selectedChain.toString()
    )
  }, [providerTokens, selectedChain])
  const manaTokenOnAssetChain: Token | undefined = useMemo(() => {
    return providerTokens.find(
      t =>
        t.address.toLocaleLowerCase() ===
        manaAddressOnAssetChain.toLocaleLowerCase()
    )
  }, [providerTokens, manaAddressOnAssetChain])

  const { gasCost, isFetchingGasCost } = onGetGasCost(
    selectedToken,
    selectedChain,
    wallet,
    providerTokens
  )

  const {
    route,
    fromAmount,
    routeFeeCost,
    routeTotalUSDCost,
    isFetchingRoute,
    routeFailed
  } = onGetCrossChainRoute(
    selectedToken,
    selectedChain,
    providerTokens,
    crossChainProvider,
    wallet
  )

  useEffect(() => {
    const provider = new AxelarProvider(squidURL)
    provider.init() // init the provider on the mount
    setCrossChainProvider(provider)
  }, [])

  const {
    isFetchingBalance,
    tokenBalance: selectedTokenBalance
  } = useTokenBalance(selectedToken, selectedChain, wallet?.address)

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
        asset.chainId,
        selectedChain,
        selectedToken.address,
        manaAddressOnAssetChain,
        wallet.network
      )
    )
  }, [asset, manaAddressOnAssetChain, selectedChain, selectedToken, wallet])

  const selectedProviderChain = useMemo(() => {
    return providerChains.find(
      c => c.chainId.toString() === selectedChain.toString()
    )
  }, [providerChains, selectedChain])

  // Compute if the price is too low for meta tx
  const hasLowPriceForMetaTx = useMemo(
    () => wallet?.chainId !== ChainId.MATIC_MAINNET && isPriceTooLow(price), // not connected to polygon AND has price < minimun for meta tx
    [price, wallet?.chainId]
  )

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

  // when providerTokens are loaded and there's no selected token or the token selected if from another network
  useEffect(() => {
    if (
      crossChainProvider?.isLibInitialized() &&
      ((!selectedToken && providerTokens.length) || // only run if not selectedToken, meaning the first render
        (selectedToken && selectedChain.toString() !== selectedToken.chainId)) // or if selectedToken is not from the selectedChain
    ) {
      try {
        setSelectedToken(
          manaTokenOnSelectedChain || getMANAToken(selectedChain)
        ) // if it's not in the providerTokens, create the object manually with the right conectract address
      } catch (error) {
        const selectedChainTokens = providerTokens.filter(
          t => t.chainId === selectedChain.toString()
        )
        setSelectedToken(selectedChainTokens[0])
      }
    }
  }, [
    crossChainProvider,
    providerTokens.length,
    manaTokenOnSelectedChain,
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

          if (
            manaTokenOnAssetChain &&
            selectedToken &&
            crossChainProvider &&
            wallet
          ) {
            // fee is paid with same token selected
            if (selectedToken.symbol === routeFeeCost.token.symbol) {
              canBuy =
                balance > Number(fromAmount) + Number(routeFeeCost.totalCost)
              if (!canBuy) {
                setInsufficientToken(selectedToken)
              }
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
              if (!canBuy) {
                setInsufficientToken(
                  !canPayForGas ? routeFeeCost.token : selectedToken
                )
              }
            }
          }
        }
        setCanBuyAsset(canBuy)
      }
    })()
  }, [
    asset,
    crossChainProvider,
    fromAmount,
    price,
    providerTokens,
    routeFeeCost,
    selectedChain,
    selectedToken,
    selectedTokenBalance,
    wallet
  ])

  const handleCrossChainBuy = useCallback(async () => {
    if (route && crossChainProvider && crossChainProvider.isLibInitialized()) {
      onBuyCrossChain(route)
    }
  }, [crossChainProvider, onBuyCrossChain, route])

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

  const handleBuyWithCard = useCallback(() => {
    if (onBuyWithCard) {
      onBuyWithCard()
    }
  }, [onBuyWithCard])

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
        {onBuyWithCard && (
          <Button
            inverted
            fluid
            data-testid={BUY_WITH_CARD_TEST_ID}
            disabled={isLoading || isLoadingAuthorization}
            loading={isLoading || isLoadingAuthorization}
            onClick={handleBuyWithCard}
          >
            <Icon name="credit card outline" />
            {t(`buy_with_crypto_modal.buy_with_card`)}
          </Button>
        )}
      </>
    )
  }, [
    isFetchingBalance,
    isLoading,
    asset.chainId,
    isLoadingAuthorization,
    onBuyWithCard,
    handleBuyWithCard,
    onGetMana,
    onClose
  ])

  const renderBuyNowButton = useCallback(() => {
    let onClick =
      selectedToken?.symbol === 'MANA' && !route
        ? onBuyNatively
        : handleCrossChainBuy

    return (
      <>
        <Button
          fluid
          primary
          data-testid={BUY_NOW_BUTTON_TEST_ID}
          disabled={
            (selectedToken?.symbol !== 'MANA' && !route) ||
            isFetchingRoute ||
            isBuyingCrossChain ||
            isLoading
          }
          loading={isFetchingBalance || isLoading}
          onClick={onClick}
        >
          <>
            {isBuyingCrossChain || isFetchingRoute ? (
              <Loader inline active size="tiny" />
            ) : null}
            {!isFetchingRoute // if fetching route, just render the Loader
              ? isBuyingCrossChain
                ? t('buy_with_crypto_modal.confirm_transaction')
                : t('buy_with_crypto_modal.buy_now')
              : null}
          </>
        </Button>
      </>
    )
  }, [
    route,
    selectedToken,
    isFetchingRoute,
    isBuyingCrossChain,
    isFetchingBalance,
    isLoading,
    onBuyNatively,
    handleCrossChainBuy
  ])

  const renderMainActionButton = useCallback(() => {
    // has a selected token and canBuyAsset was computed
    if (wallet && selectedToken && canBuyAsset !== undefined) {
      // if can't buy Get Mana and Buy With Card buttons
      if (!canBuyAsset) {
        return renderGetMANAButton()
      }

      // for any token other than MANA, it user needs to be connected on the origin chain
      if (selectedToken.symbol !== 'MANA') {
        return selectedChain === wallet.chainId
          ? renderBuyNowButton()
          : renderSwitchNetworkButton()
      }

      // for L1 NFTs
      if (asset.network === Network.ETHEREUM) {
        // if tries to buy with ETH MANA and connected to other network, should switch to ETH network to pay directly
        return selectedToken.symbol === 'MANA' &&
          wallet.network !== Network.ETHEREUM &&
          getNetwork(selectedChain) === Network.ETHEREUM
          ? renderSwitchNetworkButton()
          : renderBuyNowButton()
      }

      // for L2 NFTs paying with MANA

      // And connected to MATIC, should render the buy now button otherwise check if a meta tx is available
      if (getNetwork(selectedChain) === Network.MATIC) {
        return wallet.network === Network.MATIC
          ? renderBuyNowButton()
          : isPriceTooLow(price)
          ? renderSwitchNetworkButton() // switch to MATIC to pay for the gas
          : renderBuyNowButton()
      }

      // can buy it with MANA from other chain through the provider
      return renderBuyNowButton()
    } else if (!route && routeFailed) {
      // can't buy Get Mana and Buy With Card buttons
      return renderGetMANAButton()
    }
  }, [
    wallet,
    selectedToken,
    canBuyAsset,
    route,
    asset,
    price,
    routeFailed,
    selectedChain,
    renderBuyNowButton,
    renderSwitchNetworkButton,
    renderGetMANAButton
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
        setCanBuyAsset(undefined)
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

        analytics.track(events.CROSS_CHAIN_CHAIN_SELECTION, {
          selectedChain: selectedOption.chainId
        })
      }
    },
    [analytics, providerTokens, selectedChain]
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
        onBack={onGoBack}
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

  const assetName = useMemo(() => {
    return asset.data.ens ? (
      <>
        <strong>{asset.name}</strong>.dcl.eth
      </>
    ) : (
      asset.name
    )
  }, [asset])

  const assetDescription = useMemo(() => {
    if (asset.data.ens) {
      return t('buy_with_crypto_modal.asset_description.ens')
    } else if (asset.data.emote) {
      return t('buy_with_crypto_modal.asset_description.emotes')
    } else if (asset.data.wearable) {
      return t('buy_with_crypto_modal.asset_description.wearables')
    } else if (asset.data.estate || asset.data.parcel) {
      return t('buy_with_crypto_modal.asset_description.land')
    } else {
      return t('buy_with_crypto_modal.asset_description.other')
    }
  }, [asset])

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
                <div className={styles.assetDetails}>
                  <span className={styles.assetName}>{assetName}</span>
                  <span className={styles.assetDescription}>
                    {assetDescription}
                  </span>
                </div>
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
                isLoading={
                  isFetchingRoute ||
                  isFetchingGasCost ||
                  (shouldUseCrossChainProvider && !route)
                }
                gasCost={gasCost}
                manaTokenOnSelectedChain={manaTokenOnAssetChain}
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
              asset.network === Network.MATIC && // and it's buying a MATIC asset
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
              {canBuyAsset === false &&
              !isFetchingBalance &&
              !isFetchingRoute ? (
                <span className={styles.warning}>
                  {t('buy_with_crypto_modal.insufficient_funds', {
                    token: insufficientToken?.symbol || 'MANA'
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
