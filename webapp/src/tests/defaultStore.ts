import { createStore } from 'redux'
import { createRootReducer } from '../modules/reducer'

export const getDefaultState = () => {
  return createStore(createRootReducer()).getState()
}
