import {
  Account,
  AccountSortBy,
  Network,
  NFTCategory,
  Profile
} from '@dcl/schemas'
import { call, takeEvery, put, all } from '@redux-saga/core/effects'
import { CatalystClient } from 'dcl-catalyst-client'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isErrorWithMessage } from '../../lib/error'
import { accountAPI, nftAPI, NFTResult } from '../vendor/decentraland'
import { AccountResponse } from '../vendor/decentraland/account/types'
import {
  fetchAccountMetricsFailure,
  FetchAccountMetricsRequestAction,
  fetchAccountMetricsSuccess,
  fetchCreatorsAccountFailure,
  FetchCreatorsAccountRequestAction,
  fetchCreatorsAccountSuccess,
  FETCH_ACCOUNT_METRICS_REQUEST,
  FETCH_CREATORS_ACCOUNT_REQUEST
} from './actions'
import { fromProfilesToCreators } from './utils'

export const DEFAULT_FIRST_VALUE = 20
export const DEFAULT_SKIP_VALUE = 0

export function* accountSaga(catalystClient: CatalystClient) {
  yield takeEvery(
    FETCH_ACCOUNT_METRICS_REQUEST,
    handleFetchAccountMetricsRequest
  )
  yield takeEvery(
    FETCH_CREATORS_ACCOUNT_REQUEST,
    handleFetchCreatorsAccountsRequest
  )

  function* handleFetchCreatorsAccountsRequest(
    action: FetchCreatorsAccountRequestAction
  ): any {
    const { search } = action.payload

    try {
      let addresses: Set<string> = new Set()
      let accounts: Account[] | undefined = undefined
      if (search) {
        const { data }: { data: NFTResult[] } = yield call([nftAPI, 'fetch'], {
          category: NFTCategory.ENS,
          search,
          first: DEFAULT_FIRST_VALUE,
          skip: DEFAULT_SKIP_VALUE
        })

        addresses = new Set([...data.map(nft => nft.nft.owner)])
      } else {
        const { data }: { data: Account[] } = yield call(
          [accountAPI, 'fetch'],
          {
            sortBy: AccountSortBy.MOST_COLLECTIONS
          }
        )
        accounts = data
        addresses = new Set([...accounts.map(nft => nft.address)])
      }

      const [profiles, creatorsAccounts]: [
        Profile[],
        AccountResponse
      ] = yield all([
        call([catalystClient, 'fetchProfiles'], Array.from(addresses)),
        search
          ? call([accountAPI, 'fetch'], {
              address: Array.from(addresses),
              sortBy: AccountSortBy.MOST_COLLECTIONS
            })
          : Promise.resolve()
      ])

      const creators = fromProfilesToCreators(
        profiles,
        accounts ?? creatorsAccounts.data
      )

      yield put(fetchCreatorsAccountSuccess(search, creators))
    } catch (error) {
      yield put(
        fetchCreatorsAccountFailure(
          search,
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      )
    }
  }
}

export function* handleFetchAccountMetricsRequest(
  action: FetchAccountMetricsRequestAction
) {
  const { filters } = action.payload

  try {
    const results: AccountResponse[] = yield all([
      call([accountAPI, accountAPI.fetch], {
        ...filters,
        network: Network.ETHEREUM
      }),
      call([accountAPI, accountAPI.fetch], {
        ...filters,
        network: Network.MATIC
      })
    ])

    yield put(
      fetchAccountMetricsSuccess(filters, {
        [Network.ETHEREUM]: results[0].data,
        [Network.MATIC]: results[1].data
      })
    )
  } catch (error) {
    yield put(
      fetchAccountMetricsFailure(
        filters,
        isErrorWithMessage(error) ? error.message : t('global.unknown_error')
      )
    )
  }
}
