import {
  Account,
  AccountFilters,
  AccountSortBy,
  Network,
  NFTCategory,
  Profile
} from '@dcl/schemas'
import { CatalystClient } from 'dcl-catalyst-client'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga/effects'
import { NFTsFetchParams } from '../nft/types'
import { accountAPI, nftAPI, NFTResult } from '../vendor/decentraland'
import { AccountResponse } from '../vendor/decentraland/account/types'
import {
  fetchAccountMetricsFailure,
  fetchAccountMetricsRequest,
  fetchAccountMetricsSuccess,
  fetchCreatorsAccountFailure,
  fetchCreatorsAccountRequest,
  fetchCreatorsAccountSuccess
} from './actions'
import { accountSaga, DEFAULT_FIRST_VALUE, DEFAULT_SKIP_VALUE } from './sagas'
import { getCreators, getCreatorsSearchQuery } from './selectors'
import { CreatorAccount } from './types'
import { fromProfilesToCreators } from './utils'

let account: Account
let filters: AccountFilters
let nftAPIFilters: NFTsFetchParams
let ethereumFilters: AccountFilters
let maticFilters: AccountFilters

beforeEach(() => {
  account = {
    id: 'address',
    address: 'address',
    earned: '0',
    purchases: 0,
    royalties: '0',
    sales: 0,
    spent: '0',
    collections: 0
  }

  filters = {
    address: ['address']
  }

  ethereumFilters = {
    ...filters,
    network: Network.ETHEREUM
  }

  maticFilters = {
    ...filters,
    network: Network.MATIC
  }
})

const catalystClient = new CatalystClient({ catalystUrl: 'aMockedURL' })

describe('when handling the request to fetch account metrics', () => {
  describe('when a call to the accountApi fails', () => {
    const error = 'request failed with error'

    describe('when the call with ETHEREUM as network fails', () => {
      it('should signal that the request has failed with the request error', () => {
        return expectSaga(accountSaga, catalystClient)
          .provide([
            [
              call([accountAPI, accountAPI.fetch], ethereumFilters),
              Promise.reject(new Error(error))
            ],
            [
              call([accountAPI, accountAPI.fetch], maticFilters),
              {
                data: [account],
                total: 10
              } as AccountResponse
            ]
          ])
          .put(fetchAccountMetricsFailure(filters, error))
          .dispatch(fetchAccountMetricsRequest(filters))
          .silentRun()
      })
    })

    describe('when the call with MATIC as network fails', () => {
      it('should signal that the request has failed with the request error', () => {
        return expectSaga(accountSaga, catalystClient)
          .provide([
            [
              call([accountAPI, accountAPI.fetch], ethereumFilters),
              {
                data: [account],
                total: 10
              } as AccountResponse
            ],
            [
              call([accountAPI, accountAPI.fetch], maticFilters),
              Promise.reject(new Error(error))
            ]
          ])
          .put(fetchAccountMetricsFailure(filters, error))
          .dispatch(fetchAccountMetricsRequest(filters))
          .silentRun()
      })
    })
  })

  describe('when none of the requests fail', () => {
    it('should signal the success with the account metrics by network', () => {
      const account1: Account = { ...account, earned: '200' }
      const account2: Account = { ...account, earned: '100' }

      return expectSaga(accountSaga, catalystClient)
        .provide([
          [
            call([accountAPI, accountAPI.fetch], {
              ...filters,
              network: Network.ETHEREUM
            }),
            {
              data: [account1],
              total: 10
            } as AccountResponse
          ],
          [
            call([accountAPI, accountAPI.fetch], {
              ...filters,
              network: Network.MATIC
            }),
            {
              data: [account2],
              total: 10
            } as AccountResponse
          ]
        ])
        .put(
          fetchAccountMetricsSuccess(filters, {
            [Network.ETHEREUM]: [account1],
            [Network.MATIC]: [account2]
          })
        )
        .dispatch(fetchAccountMetricsRequest(filters))
        .silentRun()
    })
  })
})

describe('when handling the request to fetch creators accounts', () => {
  let search: string
  let accounts: Account[]
  let addresses: string[]

  describe('when the request with a search term fails while fetching the NFT API', () => {
    const error = 'request failed with error'
    let filters: NFTsFetchParams

    describe('when having the search term set', () => {
      beforeEach(() => {
        search = 'a term'
        filters = {
          category: NFTCategory.ENS,
          search,
          first: 20,
          skip: 0
        }
      })
      it('should signal that the request has failed with the request error', () => {
        return expectSaga(accountSaga, catalystClient)
          .provide([
            [select(getCreatorsSearchQuery), null],
            [
              call([nftAPI, nftAPI.fetch], filters),
              Promise.reject(new Error(error))
            ]
          ])
          .put(fetchCreatorsAccountFailure(search, error))
          .dispatch(fetchCreatorsAccountRequest(search))
          .silentRun()
      })
    })
  })

  describe('when the request without a search term fails while fetching the Accounts API', () => {
    const error = 'request failed with error'
    let filters: AccountFilters

    describe('when the call has an empty search string', () => {
      beforeEach(() => {
        search = ''
        filters = {
          sortBy: AccountSortBy.MOST_COLLECTIONS
        }
      })
      it('should signal that the request has failed with the request error', () => {
        return expectSaga(accountSaga, catalystClient)
          .provide([
            [select(getCreatorsSearchQuery), null],
            [
              call([accountAPI, accountAPI.fetch], filters),
              Promise.reject(new Error(error))
            ]
          ])
          .put(fetchCreatorsAccountFailure(search, error))
          .dispatch(fetchCreatorsAccountRequest(search))
          .silentRun()
      })
    })
  })

  describe('when a call to the catalyst profile lambda fails', () => {
    const error = 'request failed with error'
    describe('when the call with search with a term', () => {
      beforeEach(() => {
        search = ''
        accounts = [
          { address: 'address1' } as Account,
          { address: 'address2' } as Account
        ]
        filters = {
          sortBy: AccountSortBy.MOST_COLLECTIONS
        }
        addresses = accounts.map(account => account.address)
      })
      it('should signal that the request has failed with the request error', () => {
        return expectSaga(accountSaga, catalystClient)
          .provide([
            [select(getCreatorsSearchQuery), null],
            [call([accountAPI, accountAPI.fetch], filters), { data: accounts }],
            [
              call([catalystClient, 'fetchProfiles'], addresses),
              Promise.reject(new Error(error))
            ]
          ])
          .put(fetchCreatorsAccountFailure(search, error))
          .dispatch(fetchCreatorsAccountRequest(search))
          .silentRun()
      })
    })
  })

  describe('when none of the requests fail', () => {
    let search: string
    let profiles: Profile[]
    describe('and there is no search term', () => {
      beforeEach(() => {
        search = ''
        filters = {
          sortBy: AccountSortBy.MOST_COLLECTIONS
        }
        accounts = [
          { address: 'address1' } as Account,
          { address: 'address2' } as Account
        ]
        addresses = accounts.map(account => account.address)
        profiles = [
          { avatars: [{ ethAddress: addresses[0] }] } as Profile,
          { avatars: [{ ethAddress: addresses[1] }] } as Profile
        ]
      })
      it('should fetch the accounts with more collections using the accountAPI and their profiles using the catalyst lambdas', () => {
        return expectSaga(accountSaga, catalystClient)
          .provide([
            [select(getCreatorsSearchQuery), null],
            [call([accountAPI, accountAPI.fetch], filters), { data: accounts }],
            [call([catalystClient, 'fetchProfiles'], addresses), profiles]
          ])
          .put(
            fetchCreatorsAccountSuccess(
              search,
              fromProfilesToCreators(profiles, accounts)
            )
          )
          .dispatch(fetchCreatorsAccountRequest(search))
          .silentRun()
      })
    })
    describe('and there is a search term', () => {
      let nftResults: NFTResult[]
      let creatorAccounts: CreatorAccount[]
      beforeEach(() => {
        search = 'a search term'
        nftAPIFilters = {
          category: NFTCategory.ENS,
          search,
          first: DEFAULT_FIRST_VALUE,
          skip: DEFAULT_SKIP_VALUE
        }
        accounts = [
          { address: 'address1', collections: 2 } as Account,
          { address: 'address2', collections: 3 } as Account
        ]
        addresses = accounts.map(account => account.address)
        filters = {
          address: addresses,
          sortBy: AccountSortBy.MOST_COLLECTIONS
        }
        nftResults = [
          { nft: { owner: addresses[0] } } as NFTResult,
          { nft: { owner: addresses[1] } } as NFTResult
        ]
        profiles = [
          { avatars: [{ ethAddress: addresses[0] }] } as Profile,
          { avatars: [{ ethAddress: addresses[1] }] } as Profile
        ]
        creatorAccounts = fromProfilesToCreators(profiles, accounts)
      })
      describe('and the term is the same as the last search', () => {
        it('should return the accounts fetched on the lastest action', () => {
          return expectSaga(accountSaga, catalystClient)
            .provide([
              [select(getCreatorsSearchQuery), search],
              [select(getCreators), creatorAccounts],
              [call([catalystClient, 'fetchProfiles'], addresses), profiles]
            ])
            .put(fetchCreatorsAccountSuccess(search, creatorAccounts))
            .dispatch(fetchCreatorsAccountRequest(search))
            .silentRun()
        })
      })
      describe('and the term is different than the last search', () => {
        it("should fetch the ens that match the search term using the nftAPI and then and their profiles using the catalyst lambdas and accounts using the nftAPI and put the success action with the creators' profiles", () => {
          return expectSaga(accountSaga, catalystClient)
            .provide([
              [select(getCreatorsSearchQuery), null],
              [
                call([nftAPI, nftAPI.fetch], nftAPIFilters),
                { data: nftResults }
              ],
              [
                call([accountAPI, accountAPI.fetch], filters),
                { data: accounts }
              ],
              [call([catalystClient, 'fetchProfiles'], addresses), profiles]
            ])
            .put(
              fetchCreatorsAccountSuccess(
                search,
                fromProfilesToCreators(profiles, accounts)
              )
            )
            .dispatch(fetchCreatorsAccountRequest(search))
            .silentRun()
        })
      })
    })
  })
})
