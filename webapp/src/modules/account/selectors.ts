import { createSelector } from 'reselect'
import { createMatchSelector } from 'connected-react-router'
import { toBN } from 'web3x/utils'
import { Network } from 'decentraland-dapps/node_modules/@dcl/schemas'
import { RootState } from '../reducer'
import { locations } from '../routing/locations'
import { AccountMetrics } from './types'

export const getState = (state: RootState) => state.account
export const getData = (state: RootState) => getState(state).data
export const getMetricsByNetworkByAddress = (state: RootState) =>
  getState(state).metrics
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

const accountMatchSelector = createMatchSelector<
  RootState,
  { address: string }
>(locations.account(':address'))

export const getAddress = createSelector<
  RootState,
  ReturnType<typeof accountMatchSelector>,
  string | undefined
>(accountMatchSelector, match => match?.params.address?.toLowerCase())

export const getMetricsByAddressByNetwork = createSelector(
  getMetricsByNetworkByAddress,
  metrics => {
    const addresses = new Set([
      ...Object.keys(metrics.ETHEREUM),
      ...Object.keys(metrics.MATIC)
    ])

    const res: Record<string, Record<Network, AccountMetrics>> = {}

    for (const address of addresses) {
      res[address] = {
        [Network.ETHEREUM]: metrics[Network.ETHEREUM][address],
        [Network.MATIC]: metrics[Network.MATIC][address]
      }
    }

    return res
  }
)

export const getAggregatedMetricsByAddress = createSelector(
  getMetricsByAddressByNetwork,
  metrics => {
    const addresses = Object.keys(metrics)
    const res: Record<string, AccountMetrics> = {}

    const addStrings = (a: string, b: string) => {
      const bnA = toBN(a)
      const bnB = toBN(b)

      return bnA.add(bnB).toString()
    }

    for (const address of addresses) {
      const eth = metrics[address].ETHEREUM
      const mat = metrics[address].MATIC

      if (eth && !mat) {
        res[address] = eth
      } else if (!eth && mat) {
        res[address] = mat
      } else if (eth && mat) {
        res[address] = {
          ...eth,
          purchases: eth.purchases + mat.purchases,
          sales: eth.sales + mat.sales,
          earned: addStrings(eth.earned, mat.earned),
          royalties: addStrings(eth.royalties, mat.royalties),
          spent: addStrings(eth.spent, mat.spent)
        }
      }
    }

    return res
  }
)

export const getMetricsByAddress = createSelector(
  getMetricsByAddressByNetwork,
  getAggregatedMetricsByAddress,
  (metrics, aggregatedMetrics) =>
    Object.keys(metrics).reduce(
      (acc, address) => {
        acc[address] = {
          ...metrics[address],
          aggregated: aggregatedMetrics[address]
        }
        return acc
      },
      {} as Record<
        string,
        {
          [Network.ETHEREUM]: AccountMetrics
          [Network.MATIC]: AccountMetrics
          aggregated: AccountMetrics
        }
      >
    )
)
