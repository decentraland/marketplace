import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'
import { Contract } from '../vendor/services'
import { RootState } from '../reducer'
import { getContractByParams } from './utils'

export const getState = (state: RootState) => state.contract
export const getContracts = (state: RootState) => getState(state).data
export const getError = (state: RootState) => getState(state).error
export const getLoading = (state: RootState) => getState(state).loading
export const getHasFetched = (state: RootState) => getState(state).hasFetched

export const getContract = createSelectorCreator(defaultMemoize, isEqual)<
  RootState,
  Partial<Contract>,
  Partial<Contract>,
  ReturnType<typeof getContracts>,
  Contract | null
>(
  (_state: RootState, query: Partial<Contract>) => query,
  getContracts,
  (query: Partial<Contract>, contracts: Contract[]) => {
    return getContractByParams(contracts, query)
  }
)
