import classNames from 'classnames'
import { ethers } from 'ethers'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Route, Token } from 'decentraland-transactions/crossChain'
import { isPriceTooLow } from '../../../BuyPage/utils'
import { ManaToFiat } from '../../../ManaToFiat'
import { formatPrice } from '../utils'
import { GasCost, RouteFeeCost } from '../hooks'
import styles from './PurchaseTotal.module.css'

export const FREE_TX_CONVERED_TEST_ID = 'free-tx-label'

export type Props = {
  price: string
  // TODO: This shouldn't be optional
  selectedToken?: Token
  useMetaTx: boolean
  shouldUseCrossChainProvider: boolean
  route: Route | undefined
  routeFeeCost: RouteFeeCost | undefined
  fromAmount: string | undefined
  isLoading: boolean
  gasCost: GasCost | undefined
  providerTokens: Token[]
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
    providerTokens,
    routeTotalUSDCost
  } = props

  return (
    <div className={styles.totalContainer}>
      <div>
        <span className={styles.total}>{t('buy_with_crypto_modal.total')}</span>
        {useMetaTx && !isPriceTooLow(price) ? (
          <span
            className={styles.feeCovered}
            data-testid={FREE_TX_CONVERED_TEST_ID}
          >
            {t('buy_with_crypto_modal.transaction_fee_covered', {
              covered: (
                <span className={styles.feeCoveredFree}>
                  {t('buy_with_crypto_modal.covered_by_dao')}
                </span>
              )
            })}
          </span>
        ) : null}
      </div>
      <div className={styles.totalPrice}>
        {isLoading ? (
          <span
            className={classNames(styles.skeleton, styles.estimatedFeeSkeleton)}
          />
        ) : (
          <div>
            {!!selectedToken ? (
              shouldUseCrossChainProvider ? (
                !!route && routeFeeCost ? (
                  <>
                    <img
                      src={selectedToken?.logoURI}
                      alt={selectedToken?.name}
                    />
                    {routeFeeCost?.token.symbol !== selectedToken.symbol &&
                    fromAmount ? (
                      <>
                        {formatPrice(fromAmount, selectedToken)}
                        <span> + </span>
                        <img
                          src={routeFeeCost.token.logoURI}
                          alt={routeFeeCost.token.name}
                        />
                        {formatPrice(
                          routeFeeCost.totalCost,
                          routeFeeCost.token
                        )}
                      </>
                    ) : (
                      <>
                        {formatPrice(
                          Number(fromAmount) + Number(routeFeeCost.totalCost),
                          selectedToken
                        )}
                      </>
                    )}
                  </>
                ) : null
              ) : (
                <>
                  {!!gasCost && gasCost.token ? (
                    <>
                      <img
                        src={gasCost.token.logoURI}
                        alt={gasCost.token.name}
                      />
                      {formatPrice(Number(gasCost.total), gasCost.token)}
                      <span> + </span>
                    </>
                  ) : null}
                  <img src={selectedToken?.logoURI} alt={selectedToken?.name} />
                  {ethers.utils.formatEther(price)}
                </>
              )
            ) : null}
          </div>
        )}
        <div>
          {isLoading ? (
            <span
              className={classNames(
                styles.skeleton,
                styles.estimatedFeeSkeleton,
                styles.fromAmountUSD
              )}
            />
          ) : (
            <span className={styles.fromAmountUSD}>
              {!!gasCost &&
              gasCost.totalUSDPrice &&
              providerTokens.find(t => t.symbol === 'MANA') ? (
                <>
                  {' '}
                  $
                  {(
                    gasCost.totalUSDPrice +
                    providerTokens.find(t => t.symbol === 'MANA')!.usdPrice! *
                      Number(ethers.utils.formatEther(price))
                  ).toFixed(4)}{' '}
                </>
              ) : shouldUseCrossChainProvider ? (
                <>
                  {' '}
                  {!!route && routeTotalUSDCost
                    ? `$${routeTotalUSDCost?.toFixed(6)}`
                    : null}{' '}
                </>
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
