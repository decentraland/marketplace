import { RentalListing } from '@dcl/schemas'
import { showToast } from 'decentraland-dapps/dist/modules/toast/actions'
import { getState } from 'decentraland-dapps/dist/modules/toast/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { NFT } from '../nft/types'
import {
  claimLandSuccess,
  removeRentalSuccess,
  upsertRentalSuccess
} from '../rental/actions'
import { UpsertRentalOptType } from '../rental/types'
import { updateStoreSuccess } from '../store/actions'
import { getEmptyStore } from '../store/utils'
import {
  getLandClaimedBackSuccessToast,
  getListingRemoveSuccessToast,
  getStoreUpdateSuccessToast,
  getUpsertRentalSuccessToast
} from '../toast/toasts'
import { toastSaga } from './sagas'

let nft: NFT
let rental: RentalListing

beforeEach(() => {
  nft = {
    contractAddress: 'aContractAddress',
    tokenId: 'aTokenId'
  } as NFT

  rental = {
    id: 'aRentalId'
  } as RentalListing
})

describe('when updating the store settings', () => {
  it('should show an info toast if the update is successful', () => {
    const MOCKED_TOAST_MESSAGE = getStoreUpdateSuccessToast()
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .dispatch(updateStoreSuccess(getEmptyStore()))
      .put(showToast(MOCKED_TOAST_MESSAGE))
      .silentRun()
  })
})

describe('when handling the success of a LAND claimed back', () => {
  it('should show a toast signaling the user that the land has been claimed back successfully', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(showToast(getLandClaimedBackSuccessToast()))
      .dispatch(claimLandSuccess(nft, rental))
      .silentRun()
  })
})

describe('when handling the success of a rental listing removal', () => {
  it('should show a toast signaling the success of a rental listing being removed', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(showToast(getListingRemoveSuccessToast()))
      .dispatch(removeRentalSuccess(nft))
      .silentRun()
  })
})

describe('when handling the success of a rental listing update', () => {
  it('should show a toast signaling the success of a rental listing update', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(
        showToast(getUpsertRentalSuccessToast(nft, UpsertRentalOptType.EDIT))
      )
      .dispatch(upsertRentalSuccess(nft, rental, UpsertRentalOptType.EDIT))
      .silentRun()
  })
})

describe('when handling the success of a rental listing creation', () => {
  it('should show a toast signaling the success of a rental listing creation', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(
        showToast(getUpsertRentalSuccessToast(nft, UpsertRentalOptType.INSERT))
      )
      .dispatch(upsertRentalSuccess(nft, rental, UpsertRentalOptType.INSERT))
      .silentRun()
  })
})
