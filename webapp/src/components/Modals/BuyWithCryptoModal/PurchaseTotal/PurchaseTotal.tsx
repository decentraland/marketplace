import classNames from 'classnames'
import { ethers } from 'ethers'
import { Popup } from 'decentraland-ui/dist/components/Popup/Popup'
import { t } from 'decentraland-dapps/dist/modules/translation'
import { Route, Token } from 'decentraland-transactions/crossChain'
import { isPriceTooLow } from '../../../BuyPage/utils'
import { ManaToFiat } from '../../../ManaToFiat'
import { formatPrice } from '../utils'
import { GasCostValues, RouteFeeCost } from '../hooks'
import styles from './PurchaseTotal.module.css'

export const FREE_TX_COVERED_TEST_ID = 'free-tx-label'

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
          <span
            className={styles.feeCovered}
            data-testid={FREE_TX_COVERED_TEST_ID}
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
            {shouldUseCrossChainProvider ? (
              !!route && routeFeeCost ? (
                <>
                  <Popup
                    content={selectedToken.name}
                    style={{ zIndex: 3001 }}
                    on="hover"
                    position="top center"
                    trigger={
                      <img
                        src={selectedToken.logoURI}
                        alt={selectedToken.name}
                      />
                    }
                  />
                  {routeFeeCost?.token.symbol !== selectedToken.symbol &&
                  fromAmount ? (
                    <>
                      {formatPrice(fromAmount, selectedToken)}
                      <span> + </span>
                      <Popup
                        content={routeFeeCost.token.name}
                        style={{ zIndex: 3001 }}
                        on="hover"
                        position="top center"
                        trigger={
                          <img
                            src={routeFeeCost.token.logoURI}
                            alt={routeFeeCost.token.name}
                          />
                        }
                      />
                      {routeFeeCost.totalCost}
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
                    <Popup
                      content={gasCost.token.name}
                      style={{ zIndex: 3001 }}
                      on="hover"
                      position="top center"
                      trigger={
                        <img
                          src={gasCost.token.logoURI}
                          alt={gasCost.token.name}
                        />
                      }
                    />
                    {formatPrice(Number(gasCost.total), gasCost.token)}
                    <span> + </span>
                  </>
                ) : null}
                <Popup
                  content={selectedToken.name}
                  style={{ zIndex: 3001 }}
                  on="hover"
                  position="top center"
                  trigger={
                    <img src={selectedToken.logoURI} alt={selectedToken.name} />
                  }
                />
                {ethers.utils.formatEther(price)}
              </>
            )}
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
              manaTokenOnSelectedChain ? (
                <>
                  {' '}
                  $
                  {manaTokenOnSelectedChain.usdPrice
                    ? (
                        gasCost.totalUSDPrice +
                        manaTokenOnSelectedChain.usdPrice! *
                          Number(ethers.utils.formatEther(price))
                      ).toFixed(4)
                    : 'Unknown'}{' '}
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
