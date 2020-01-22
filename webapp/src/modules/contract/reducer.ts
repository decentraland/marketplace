import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { Contract, Category, ContractAddress } from './types'
import { AnyAction } from 'redux'

export type ContractState = {
  data: Record<string, Contract>
  loading: LoadingState
  error: string | null
}

const INTIAL_STATE: ContractState = {
  data: {
    [ContractAddress.LAND]: {
      name: 'LAND',
      address: ContractAddress.LAND,
      category: Category.PARCEL
    },
    [ContractAddress.ESTATE]: {
      name: 'Estate',
      address: ContractAddress.ESTATE,
      category: Category.ESTATE
    },
    [ContractAddress.EXCLUSIVE_MASKS]: {
      name: 'ExclusiveMasksCollection',
      address: ContractAddress.EXCLUSIVE_MASKS,
      category: Category.WEARABLE
    },
    [ContractAddress.HALLOWEEN_2019]: {
      name: 'Halloween2019Collection',
      address: ContractAddress.HALLOWEEN_2019,
      category: Category.WEARABLE
    },
    [ContractAddress.XMAS_2019]: {
      name: 'Xmas2019Collection',
      address: ContractAddress.XMAS_2019,
      category: Category.WEARABLE
    }
  },
  loading: [],
  error: null
}

type ContractReducerAction = AnyAction

export function contractReducer(
  state: ContractState = INTIAL_STATE,
  action: ContractReducerAction
) {
  switch (action.type) {
    default:
      return state
  }
}
