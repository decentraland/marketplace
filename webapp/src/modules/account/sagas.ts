import {
  Account,
  AccountSortBy,
  Network,
  NFTCategory,
  Profile
} from '@dcl/schemas'
import { call, takeEvery, put, all } from '@redux-saga/core/effects'
import { LambdasClient } from 'dcl-catalyst-client/dist/client/LambdasClient'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { cancelled, select, takeLatest } from 'redux-saga/effects'
import { isErrorWithMessage } from '../../lib/error'
import {
  accountAPI,
  nftAPI,
  NFTResponse,
  NFTResult
} from '../vendor/decentraland'
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
import { getCreators, getCreatorsSearchQuery } from './selectors'
import { CreatorAccount } from './types'
import { enhanceCreatorName, fromProfilesToCreators } from './utils'

export const DEFAULT_FIRST_VALUE = 20
export const DEFAULT_SKIP_VALUE = 0
export const MAX_ENS_SEARCH_REQUESTS = 5

export function* accountSaga(catalystLambdasClient: LambdasClient) {
  yield takeEvery(
    FETCH_ACCOUNT_METRICS_REQUEST,
    handleFetchAccountMetricsRequest
  )
  yield takeLatest(
    FETCH_CREATORS_ACCOUNT_REQUEST,
    handleFetchCreatorsAccountsRequest
  )

  function* handleFetchCreatorsAccountsRequest(
    action: FetchCreatorsAccountRequestAction
  ): any {
    const { search, searchUUID } = action.payload

    const previousSearch: string | null = yield select(getCreatorsSearchQuery)
    if (previousSearch === search) {
      const fetchedCreators: CreatorAccount[] = yield select(getCreators)
      yield put(fetchCreatorsAccountSuccess(search, fetchedCreators))
      return
    }

    try {
      let addresses: Set<string> = new Set()
      let ens: NFTResult[] = []
      let accounts: Account[] | undefined = undefined
      if (search) {
        let skip = 0
        while (true) {
          const { data, total }: NFTResponse = yield call([nftAPI, 'fetch'], {
            category: NFTCategory.ENS,
            search,
            first: DEFAULT_FIRST_VALUE,
            skip
          })

          ens = [...ens, ...data]
          const hasReachedMaxSearchRequests =
            MAX_ENS_SEARCH_REQUESTS - 1 === skip / DEFAULT_FIRST_VALUE
          const hasFetchedAllResults = total === ens.length

          if (hasFetchedAllResults || hasReachedMaxSearchRequests) {
            break
          }
          skip += DEFAULT_FIRST_VALUE
        }
        addresses = new Set(ens.map(nft => nft.nft.owner))
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
        call([catalystLambdasClient, 'getAvatarsDetailsByPost'], {
          ids: Array.from(addresses)
        }),
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
      if (search) {
        creators.forEach(creator => enhanceCreatorName(creator, ens, search))
      }

      yield put(fetchCreatorsAccountSuccess(search, creators, searchUUID))
    } catch (error) {
      yield put(
        fetchCreatorsAccountFailure(
          search,
          isErrorWithMessage(error) ? error.message : t('global.unknown_error')
        )
      )
    } finally {
      // cancel ongoing requests and emit a failure to clean the loading state
      if (yield cancelled()) {
        yield put(fetchCreatorsAccountFailure(search, 'cancelled'))
      }
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
