import { RentalListing } from '@dcl/schemas'
import { getOpenModals } from 'decentraland-dapps/dist/modules/modal/selectors'
import { closeAllModals, closeModal, openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { NFT } from '../nft/types'
import {
  claimAssetSuccess,
  upsertRentalSuccess,
  removeRentalSuccess,
  acceptRentalListingSuccess,
  CLAIM_ASSET_SUCCESS,
  UPSERT_RENTAL_SUCCESS
} from '../rental/actions'
import {
  BULK_PICK_FAILURE,
  BULK_PICK_SUCCESS,
  CREATE_LIST_SUCCESS,
  DELETE_LIST_FAILURE,
  DELETE_LIST_SUCCESS,
  UPDATE_LIST_SUCCESS
} from '../favorites/actions'
import { UpsertRentalOptType } from '../rental/types'
import { modalSaga } from './sagas'

describe.each([
  CLAIM_ASSET_SUCCESS,
  UPSERT_RENTAL_SUCCESS,
  CREATE_LIST_SUCCESS,
  DELETE_LIST_SUCCESS,
  DELETE_LIST_FAILURE,
  BULK_PICK_SUCCESS,
  BULK_PICK_FAILURE,
  UPDATE_LIST_SUCCESS
])('when handling the success action of the %s action', actionType => {
  it('should put the action to close all modals', () => {
    return expectSaga(modalSaga).put(closeAllModals()).dispatch({ type: actionType }).silentRun()
  })
})

describe('when handling the success action of the claim LAND', () => {
  let nft: NFT
  let rental: RentalListing

  beforeEach(() => {
    nft = { id: 'aNftId' } as NFT
    rental = { id: 'aRentalId' } as RentalListing
  })

  it('should put the action to close all modals', () => {
    return expectSaga(modalSaga).put(closeAllModals()).dispatch(claimAssetSuccess(nft, rental)).silentRun()
  })
})

describe('when handling the success action of a rental removal', () => {
  let nft: NFT

  beforeEach(() => {
    nft = { id: 'aNftId' } as NFT
  })

  describe('and it is removing the rental from the RemoveRentalModal confirmation modal', () => {
    it('should put the action to close all modals', () => {
      return expectSaga(modalSaga)
        .put(closeAllModals())
        .provide([[select(getOpenModals), { RemoveRentalModal: true }]])
        .dispatch(removeRentalSuccess(nft))
        .silentRun()
    })
  })

  describe('and it is removing the rental from the upsert modal', () => {
    it('should not put the close modals action', () => {
      return expectSaga(modalSaga)
        .provide([[select(getOpenModals), { RemoveRentalModal: false }]])
        .not.put(closeAllModals())
        .dispatch(removeRentalSuccess(nft))
        .silentRun()
    })
  })
})

describe('when handling the success action of a rental creation', () => {
  let nft: NFT
  let rental: RentalListing

  beforeEach(() => {
    nft = { id: 'aNftId' } as NFT
    rental = { id: 'aRentalId' } as RentalListing
  })

  it('should put the action to close all modals', () => {
    return expectSaga(modalSaga)
      .put(closeAllModals())
      .dispatch(upsertRentalSuccess(nft, rental, UpsertRentalOptType.INSERT))
      .silentRun()
  })
})

describe('when handling the success action of a accepting a rental listing', () => {
  let nft: NFT
  let rental: RentalListing
  let periodIndexChosen: number

  beforeEach(() => {
    nft = { id: 'aNftId' } as NFT
    rental = { id: 'aRentalId' } as RentalListing
    periodIndexChosen = 0
  })

  it('should put the action to open the RentConfirmedModal modal and close the ConfirmRentModal', () => {
    return expectSaga(modalSaga)
      .put(openModal('RentConfirmedModal', { rental, periodIndexChosen }))
      .put(closeModal('ConfirmRentModal'))
      .dispatch(acceptRentalListingSuccess(nft, rental, periodIndexChosen))
      .silentRun()
  })
})
