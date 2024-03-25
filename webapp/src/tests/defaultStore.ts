import { createMemoryHistory } from 'history'
import { createStore } from 'redux'
import { createRootReducer } from '../modules/reducer'

export const getDefaultState = () => {
  const testHistory = createMemoryHistory({ initialEntries: ['/marketplace'] })
  return createStore(createRootReducer(testHistory)).getState()
}
