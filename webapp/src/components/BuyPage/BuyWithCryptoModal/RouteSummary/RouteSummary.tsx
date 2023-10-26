import { ethers } from 'ethers'
import classNames from 'classnames'
import { Token, RouteResponse } from '@0xsquid/sdk/dist/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import styles from './RouteSummary.module.css'

export type RouteSummaryProps = {
  route: RouteResponse | undefined
  selectedToken: Token
}

const RouteSummary = ({ route, selectedToken }: RouteSummaryProps) => {
  return (
    <>
      <div className={styles.summaryContainer}>
        <span>{t('buy_with_crypto.summary')}</span>
        <div className={styles.summaryRow}>
          {t('buy_with_crypto.route.nft_cost')}
          {route ? (
            <>
              {ethers.utils.formatUnits(
                route.route.estimate.fromAmount,
                selectedToken.decimals
              )}{' '}
              {selectedToken.symbol}
            </>
          ) : (
            <div
              className={classNames(styles.skeleton, styles.exchangeSkeleton)}
            />
          )}
        </div>
        <div className={styles.summaryRow}>
          {t('buy_with_crypto.route.exchange_rate')}
          {route ? (
            <>
              1 {selectedToken.symbol} ={' '}
              {route.route.estimate.exchangeRate?.slice(0, 7)} MANA
            </>
          ) : (
            <div
              className={classNames(styles.skeleton, styles.exchangeSkeleton)}
            />
          )}
        </div>

        <div className={styles.summaryRow}>
          {t('buy_with_crypto.route.estimated_route_duration')}
          {route ? (
            <>{route.route.estimate.estimatedRouteDuration}s</>
          ) : (
            <div
              className={classNames(styles.skeleton, styles.exchangeSkeleton)}
            />
          )}
        </div>

        {route?.route.estimate.gasCosts.map((gasCost, index) => (
          <span key={index}>
            {t('buy_with_crypto.route.gas_cost_in_token', {
              cost: ethers.utils.formatEther(gasCost.amount).slice(0, 6),
              token: gasCost.token.symbol,
              costInUSD: gasCost.amountUsd
            })}
          </span>
        )) || (
          <div>
            {[...Array(2).keys()].map((_, index) => (
              <div className={styles.composeSkeletonConatiner} key={index}>
                <div
                  className={classNames(styles.skeleton, styles.shortSkeleton)}
                />
                :
                <div
                  className={classNames(styles.skeleton, styles.longSkeleton)}
                />
              </div>
            ))}
          </div>
        )}
        {route?.route.estimate.feeCosts.map(feeCost => (
          <span key={feeCost.name}>
            {t('buy_with_crypto.route.fee_cost', {
              feeName: feeCost.name,
              cost: ethers.utils.formatEther(feeCost.amount).slice(0, 6),
              token: feeCost.token.symbol,
              costInUSD: feeCost.amountUsd
            })}
          </span>
        )) || (
          <div className={styles.summaryRow}>
            <div
              className={classNames(styles.skeleton, styles.shortSkeleton)}
            />
            :
            <div className={classNames(styles.skeleton, styles.longSkeleton)} />
          </div>
        )}
      </div>
    </>
  )
}

export default RouteSummary
