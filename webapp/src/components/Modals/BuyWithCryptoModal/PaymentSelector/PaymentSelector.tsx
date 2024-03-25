import { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { ethers } from 'ethers'
import { Network } from '@dcl/schemas'
import { ChainId, getNetwork } from '@dcl/schemas/dist/dapps/chain-id'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import type { ChainData, Route, Token } from 'decentraland-transactions/crossChain'
import { Icon, InfoTooltip } from 'decentraland-ui'
import { ManaToFiat } from '../../../ManaToFiat'
import { GasCostValues, RouteFeeCost } from '../hooks'
import { TokenIcon } from '../TokenIcon'
import { formatPrice } from '../utils'
import { CHAIN_SELECTOR_DATA_TEST_ID, PAY_WITH_DATA_TEST_ID, TOKEN_SELECTOR_DATA_TEST_ID } from './constants'
import styles from './PaymentSelector.module.css'

type Props = {
  price: string
  shouldUseCrossChainProvider: boolean
  isBuyingAsset: boolean
  amountInSelectedToken: string | undefined
  route: Route | undefined
  routeFeeCost: RouteFeeCost | undefined
  gasCost: GasCostValues | undefined
  isFetchingGasCost: boolean
  providerTokens: Token[]
  selectedToken: Token
  selectedChain: ChainId
  wallet: Wallet | null
  selectedProviderChain: ChainData | undefined
  isFetchingBalance: boolean
  selectedTokenBalance: ethers.BigNumber | undefined
  onShowChainSelector: () => unknown
  onShowTokenSelector: () => unknown
}

const getUsdRouteCost = (routeFeeCost: RouteFeeCost, tokens: Token[]): string => {
  const usdPrice = tokens.find(t => t.symbol === routeFeeCost.token.symbol)?.usdPrice
  return usdPrice ? ((Number(routeFeeCost.feeCost) + Number(routeFeeCost.gasCost)) * usdPrice).toFixed(4) : 'Unknown'
}

const PaymentSelector = (props: Props) => {
  const {
    price,
    shouldUseCrossChainProvider,
    route,
    gasCost,
    isFetchingGasCost,
    isBuyingAsset,
    routeFeeCost,
    selectedToken,
    selectedChain,
    amountInSelectedToken,
    selectedProviderChain,
    providerTokens,
    wallet,
    selectedTokenBalance,
    isFetchingBalance,
    onShowChainSelector,
    onShowTokenSelector
  } = props

  const canSelectChainAndToken = useMemo(() => {
    return BigInt(price) > BigInt(0)
  }, [price])

  const renderTokenBalance = useCallback(() => {
    let balance
    if (selectedToken && selectedToken.symbol === 'MANA') {
      balance = wallet?.networks[(getNetwork(selectedChain) as Network.ETHEREUM) || Network.MATIC]?.mana.toFixed(2) ?? 0
    } else if (selectedToken && selectedTokenBalance) {
      balance = Number(ethers.utils.formatUnits(selectedTokenBalance, selectedToken.decimals)).toFixed(4)
    }

    return !isFetchingBalance ? <span className={styles.balance}>{balance}</span> : <div className={styles.balanceSkeleton} />
  }, [wallet, isFetchingBalance, selectedChain, selectedToken, selectedTokenBalance])

  const usdRouteFeeCost = useMemo(() => routeFeeCost && getUsdRouteCost(routeFeeCost, providerTokens), [routeFeeCost, providerTokens])

  return (
    <div className={styles.payWithContainer} data-testid={PAY_WITH_DATA_TEST_ID}>
      {canSelectChainAndToken ? (
        <div className={styles.dropdownContainer}>
          <div>
            <span>{t('buy_with_crypto_modal.pay_with')}</span>
            <div
              className={classNames(styles.tokenAndChainSelector, isBuyingAsset ? styles.dropdownDisabled : styles.dropdownEnabled)}
              data-testid={CHAIN_SELECTOR_DATA_TEST_ID}
              onClick={!isBuyingAsset ? onShowChainSelector : undefined}
            >
              <img src={selectedProviderChain?.nativeCurrency.icon} alt={selectedProviderChain?.nativeCurrency.name} />
              <span className={styles.tokenAndChainSelectorName}> {selectedProviderChain?.networkName} </span>
              {<Icon name="chevron down" />}
            </div>
          </div>
          <div className={styles.tokenDropdownContainer}>
            <div
              className={classNames(
                styles.tokenAndChainSelector,
                styles.tokenDropdown,
                isBuyingAsset ? styles.dropdownDisabled : styles.dropdownEnabled
              )}
              data-testid={TOKEN_SELECTOR_DATA_TEST_ID}
              onClick={!isBuyingAsset ? onShowTokenSelector : undefined}
            >
              <img src={selectedToken.logoURI} alt={selectedToken.name} />
              <span className={styles.tokenAndChainSelectorName}>{selectedToken.symbol} </span>
              <div className={styles.balanceContainer}>
                {t('buy_with_crypto_modal.balance')}: {renderTokenBalance()}
              </div>
              {!isBuyingAsset && <Icon name="chevron down" />}
            </div>
          </div>
        </div>
      ) : null}
      <div className={styles.costContainer}>
        {selectedToken ? (
          <>
            <div className={styles.itemCost}>
              <>
                <div className={styles.itemCostLabels}>{t('buy_with_crypto_modal.item_cost')}</div>
                <div className={styles.fromAmountContainer}>
                  <div className={styles.fromAmountTokenContainer}>
                    <TokenIcon src={selectedToken.logoURI} name={selectedToken.name} />
                    {selectedToken.symbol === 'MANA' ? (
                      ethers.utils.formatEther(price)
                    ) : amountInSelectedToken ? (
                      amountInSelectedToken
                    ) : (
                      <span className={classNames(styles.skeleton, styles.estimatedFeeSkeleton)} />
                    )}
                  </div>
                  {amountInSelectedToken || selectedToken.symbol === 'MANA' ? (
                    <span className={styles.fromAmountUSD}>
                      ≈{' '}
                      {!!route && selectedToken.usdPrice ? (
                        <>${(Number(amountInSelectedToken) * selectedToken.usdPrice).toFixed(4)}</>
                      ) : (
                        <ManaToFiat mana={price} digits={4} />
                      )}
                    </span>
                  ) : null}
                </div>
              </>
            </div>

            {shouldUseCrossChainProvider || !!gasCost || isFetchingGasCost ? (
              <div className={styles.itemCost}>
                <div className={styles.feeCostContainer}>
                  {t('buy_with_crypto_modal.fee_cost')}
                  <InfoTooltip
                    content={t(
                      shouldUseCrossChainProvider && getNetwork(selectedChain) !== Network.MATIC
                        ? 'buy_with_crypto_modal.tooltip.cross_chain'
                        : 'buy_with_crypto_modal.tooltip.same_network'
                    )}
                    style={{ zIndex: 3001 }}
                    position="top center"
                  />
                </div>
                <div className={styles.fromAmountContainer}>
                  {gasCost && gasCost.token ? (
                    <div className={styles.fromAmountTokenContainer}>
                      <TokenIcon src={gasCost.token.logoURI} name={gasCost.token.name} />
                      {formatPrice(gasCost.total, gasCost.token)}
                    </div>
                  ) : !!route && routeFeeCost ? (
                    <div className={styles.fromAmountTokenContainer}>
                      <TokenIcon src={route.route.estimate.gasCosts[0].token.logoURI} name={route.route.estimate.gasCosts[0].token.name} />
                      {routeFeeCost.totalCost}
                    </div>
                  ) : (
                    <div className={classNames(styles.skeleton, styles.estimatedFeeSkeleton)} />
                  )}
                  {gasCost && gasCost.totalUSDPrice ? (
                    <span className={styles.fromAmountUSD}>≈ ${gasCost.totalUSDPrice.toFixed(4)}</span>
                  ) : usdRouteFeeCost ? (
                    <span className={styles.fromAmountUSD}>≈ ${usdRouteFeeCost}</span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}

export default PaymentSelector
