import { AnyAction } from 'redux'
import { call, takeEvery } from 'redux-saga/effects'
import { PayloadAction } from 'typesafe-actions'

export function* errorsSaga() {
  yield takeEvery(
    (action: AnyAction) => action.type.startsWith('[Failure]'),
    handleFailingAction
  )
}

function* handleFailingAction(
  action: PayloadAction<any, { error?: string } | undefined>
) {
  if (action?.payload?.error && Rollbar) {
    yield call([Rollbar, 'error'], action?.payload?.error)
  }
}
