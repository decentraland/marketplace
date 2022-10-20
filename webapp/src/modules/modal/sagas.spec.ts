import { RentalListing } from '@dcl/schemas'
import { getOpenModals } from 'decentraland-dapps/dist/modules/modal/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { NFT } from '../nft/types'
import {
  claimLandSuccess,
  upsertRentalSuccess,
  removeRentalSuccess,
  acceptRentalListingSuccess
} from '../rental/actions'
import { UpsertRentalOptType } from '../rental/types'
import { closeAllModals, openModal } from './actions'
import { modalSaga } from './sagas'

describe('when handling the success action of the claim LAND', () => {
  let nft: NFT
  let rental: RentalListing

  beforeEach(() => {
    nft = { id: 'aNftId' } as NFT
    rental = { id: 'aRentalId' } as RentalListing
  })

  it('should put the action to close all modals', () => {
    return expectSaga(modalSaga)
      .put(closeAllModals())
      .dispatch(claimLandSuccess(nft, rental))
      .silentRun()
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

describe('when handling the success action of a rental edit', () => {
  let nft: NFT
  let rental: RentalListing

  beforeEach(() => {
    nft = { id: 'aNftId' } as NFT
    rental = { id: 'aRentalId' } as RentalListing
  })

  it('should put the action to close all modals', () => {
    return expectSaga(modalSaga)
      .put(closeAllModals())
      .dispatch(upsertRentalSuccess(nft, rental, UpsertRentalOptType.EDIT))
      .silentRun()
  })
})

describe('when handling the success action of a accepting a rental listing', () => {
  let rental: RentalListing
  let periodIndexChosen: number

  beforeEach(() => {
    rental = { id: 'aRentalId' } as RentalListing
    periodIndexChosen = 0
  })

  it('should put the action to open the RentConfirmedModal modal', () => {
    return expectSaga(modalSaga)
      .put(openModal('RentConfirmedModal', { rental, periodIndexChosen }))
      .dispatch(acceptRentalListingSuccess(rental, periodIndexChosen))
      .silentRun()
  })
})
