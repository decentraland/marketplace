import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'
import { Contract } from '../vendor/services'
import { RootState } from '../reducer'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_CONTRACTS_REQUEST } from './actions'

export const getState = (state: RootState) => state.contract
export const getContracts = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading

export const getContract = createSelectorCreator(defaultMemoize, isEqual)<
  RootState,
  Partial<Contract>,
  Partial<Contract>,
  ReturnType<typeof getLoading>,
  ReturnType<typeof getContracts>,
  Contract | null
>(
  (_state: RootState, query: Partial<Contract>) => query,
  getLoading,
  getContracts,
  (query: Partial<Contract>, loading: LoadingState, contracts: Contract[]) => {
    if (isLoadingType(loading, FETCH_CONTRACTS_REQUEST)) return null

    const found = contracts.find(contract =>
      Object.keys(query).every(
        key =>
          query[key as keyof Contract]?.toString().toLowerCase() ===
          contract[key as keyof Contract]?.toString().toLowerCase()
      )
    )

    if (!found) {
      throw new Error(`Contract not found, query=${JSON.stringify(query)}`)
    }

    return found
  }
)
