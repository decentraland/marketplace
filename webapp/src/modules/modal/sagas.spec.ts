import { RentalListing } from '@dcl/schemas'
import { expectSaga } from 'redux-saga-test-plan'
import { NFT } from '../nft/types'
import {
  claimLandSuccess,
  createRentalSuccess,
  removeRentalSuccess
} from '../rental/actions'
import { closeAllModals } from './actions'
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

  it('should put the action to close all modals', () => {
    return expectSaga(modalSaga)
      .put(closeAllModals())
      .dispatch(removeRentalSuccess(nft))
      .silentRun()
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
      .dispatch(createRentalSuccess(nft, rental))
      .silentRun()
  })
})
