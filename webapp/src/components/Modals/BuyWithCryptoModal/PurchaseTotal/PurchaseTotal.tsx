import classNames from 'classnames'
import { ethers } from 'ethers'
import { t } from 'decentraland-dapps/dist/modules/translation'
import type { Route, Token } from 'decentraland-transactions/crossChain'
import { isPriceTooLow } from '../../../BuyPage/utils'
import { ManaToFiat } from '../../../ManaToFiat'
import { formatPrice } from '../utils'
import { GasCostValues, RouteFeeCost } from '../hooks'
import { FREE_TX_COVERED_TEST_ID } from './constants'
import { TokenIcon } from '../TokenIcon'
import styles from './PurchaseTotal.module.css'

export type Props = {
  price: string
  selectedToken: Token
  useMetaTx: boolean
  shouldUseCrossChainProvider: boolean
  route: Route | undefined
  routeFeeCost: RouteFeeCost | undefined
  fromAmount: string | undefined
  isLoading: boolean
  gasCost: GasCostValues | undefined
  manaTokenOnSelectedChain: Token | undefined
  routeTotalUSDCost: number | undefined
}

const PurchaseTotal = (props: Props) => {
  const {
    price,
    route,
    routeFeeCost,
    isLoading,
    useMetaTx,
    shouldUseCrossChainProvider,
    selectedToken,
    fromAmount,
    gasCost,
    manaTokenOnSelectedChain,
    routeTotalUSDCost
  } = props

  return (
    <div className={styles.totalContainer}>
      <div>
        <span className={styles.total}>{t('buy_with_crypto_modal.total')}</span>
        {useMetaTx && !isPriceTooLow(price) ? (
          <span className={styles.feeCovered} data-testid={FREE_TX_COVERED_TEST_ID}>
            {t('buy_with_crypto_modal.transaction_fee_covered', {
              covered: <span className={styles.feeCoveredFree}>{t('buy_with_crypto_modal.covered_by_dao')}</span>
            })}
          </span>
        ) : null}
      </div>
      <div className={styles.totalPrice}>
        {isLoading ? (
          <span className={classNames(styles.skeleton, styles.estimatedFeeSkeleton)} />
        ) : (
          <div>
            {shouldUseCrossChainProvider ? (
              !!route && routeFeeCost ? (
                <>
                  <TokenIcon src={selectedToken.logoURI} name={selectedToken.name} />
                  {routeFeeCost?.token.symbol !== selectedToken.symbol && fromAmount ? (
                    <>
                      {formatPrice(fromAmount, selectedToken)}
                      <span> + </span>
                      <TokenIcon src={routeFeeCost.token.logoURI} name={routeFeeCost.token.name} />
                      {routeFeeCost.totalCost}
                    </>
                  ) : (
                    <>{formatPrice(Number(fromAmount) + Number(routeFeeCost.totalCost), selectedToken)}</>
                  )}
                </>
              ) : null
            ) : (
              <>
                {!!gasCost && gasCost.token ? (
                  <>
                    <TokenIcon src={gasCost.token.logoURI} name={gasCost.token.name} />
                    {formatPrice(Number(gasCost.total), gasCost.token)}
                    <span> + </span>
                  </>
                ) : null}
                <TokenIcon src={selectedToken.logoURI} name={selectedToken.name} />
                {ethers.utils.formatEther(price)}
              </>
            )}
          </div>
        )}
        <div>
          {isLoading ? (
            <span className={classNames(styles.skeleton, styles.estimatedFeeSkeleton, styles.fromAmountUSD)} />
          ) : (
            <span className={styles.fromAmountUSD}>
              {!!gasCost && gasCost.totalUSDPrice && manaTokenOnSelectedChain ? (
                <>
                  {' '}
                  $
                  {manaTokenOnSelectedChain.usdPrice
                    ? (gasCost.totalUSDPrice + manaTokenOnSelectedChain.usdPrice * Number(ethers.utils.formatEther(price))).toFixed(4)
                    : 'Unknown'}{' '}
                </>
              ) : shouldUseCrossChainProvider ? (
                <> {!!route && routeTotalUSDCost ? `$${routeTotalUSDCost?.toFixed(6)}` : null} </>
              ) : (
                <ManaToFiat mana={price} digits={4} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseTotal
