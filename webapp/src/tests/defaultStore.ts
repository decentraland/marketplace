import { createStore } from 'redux'
import { createMemoryHistory } from 'history'
import { createRootReducer } from '../modules/reducer'

export const getDefaultState = () => {
  const testHistory = createMemoryHistory({ initialEntries: ['/marketplace'] })
  return createStore(createRootReducer(testHistory)).getState()
}
