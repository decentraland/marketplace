import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { getState } from 'decentraland-dapps/dist/modules/toast/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { updateStoreSuccess } from '../store/actions'
import { getEmptyStore } from '../store/utils'
import { getStoreUpdateSucessToast } from '../toast/toasts'

import { toastSaga } from './sagas'

describe('when updating the store settings', () => {
  it('should show an info toast if the update is successful', () => {
    const MOCKED_TOAST_MESSAGE = getStoreUpdateSucessToast()
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .dispatch(updateStoreSuccess(getEmptyStore()))
      .put(showToast(MOCKED_TOAST_MESSAGE))
      .silentRun()
  })
})
