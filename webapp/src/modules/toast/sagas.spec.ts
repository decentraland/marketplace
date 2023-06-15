import { Item, Order, RentalListing } from '@dcl/schemas'
import {
  hideAllToasts,
  showToast
} from 'decentraland-dapps/dist/modules/toast/actions'
import { getState } from 'decentraland-dapps/dist/modules/toast/selectors'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import {
  bulkPickUnpickFailure,
  bulkPickUnpickSuccess,
  deleteListFailure,
  deleteListSuccess,
  pickItemAsFavoriteFailure,
  pickItemAsFavoriteRequest,
  pickItemAsFavoriteSuccess,
  unpickItemAsFavoriteFailure,
  unpickItemAsFavoriteSuccess,
  updateListSuccess
} from '../favorites/actions'
import {
  FetchItemsFailureAction,
  buyItemWithCardFailure,
  fetchItemsFailure
} from '../item/actions'
import { NFT, NFTsFetchOptions } from '../nft/types'
import {
  executeOrderFailure,
  executeOrderWithCardFailure
} from '../order/actions'
import {
  claimAssetSuccess,
  removeRentalSuccess,
  upsertRentalSuccess
} from '../rental/actions'
import { UpsertRentalOptType } from '../rental/types'
import { updateStoreSuccess } from '../store/actions'
import { getEmptyStore } from '../store/utils'
import {
  getExecuteOrderFailureToast,
  getBuyNFTWithCardErrorToast,
  getLandClaimedBackSuccessToast,
  getListingRemoveSuccessToast,
  getStoreUpdateSuccessToast,
  getUpsertRentalSuccessToast,
  getPickItemAsFavoriteSuccessToast,
  getPickItemAsFavoriteFailureToast,
  getUnpickItemAsFavoriteFailureToast,
  getUnpickItemAsFavoriteSuccessToast,
  getFetchAssetsFailureToast,
  getDeleteListSuccessToast,
  getDeleteListFailureToast,
  getBulkPickItemSuccessToast,
  getBulkPickItemFailureToast,
  getUpdateListSuccessToast
} from '../toast/toasts'
import { ItemBrowseOptions } from '../item/types'
import { FetchNFTsFailureAction, fetchNFTsFailure } from '../nft/actions'
import { List } from '../favorites/types'
import { UpdateOrCreateList } from '../vendor/decentraland/favorites/types'
import { toastSaga } from './sagas'
import { toastDispatchableActionsChannel } from './utils'

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
      .dispatch(claimAssetSuccess(nft, rental))
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

describe('when handling the failure of a buy NFTs with card', () => {
  const errorMessage = 'anError'

  it('should show a toast signaling the failure of the purchase with card of an item', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(showToast(getBuyNFTWithCardErrorToast(), 'bottom center'))
      .dispatch(buyItemWithCardFailure(errorMessage))
      .silentRun()
  })

  it('should show a toast signaling the failure of the order with card execution', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(showToast(getBuyNFTWithCardErrorToast(), 'bottom center'))
      .dispatch(executeOrderWithCardFailure(errorMessage))
      .silentRun()
  })
})

describe('when handling the failure of execute order', () => {
  const error = 'anError'
  const order = {
    contractAddress: 'aContractAddress',
    tokenId: 'aTokenId',
    price: '100000000000'
  } as Order

  it('should show a toast signaling the failure', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(showToast(getExecuteOrderFailureToast(), 'bottom center'))
      .dispatch(executeOrderFailure(order, nft, error))
      .silentRun()
  })
})

describe('when handling the success of picking an item as favorite', () => {
  it('should show a toast signaling the success ', () => {
    const item = {} as Item
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(hideAllToasts())
      .put(showToast(getPickItemAsFavoriteSuccessToast(item), 'bottom center'))
      .dispatch(pickItemAsFavoriteSuccess(item))
      .silentRun()
  })
})

describe('when handling the failure of picking an item as favorite', () => {
  it('should show a toast signaling the failure ', () => {
    const item = {} as Item
    const error = 'anError'
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(hideAllToasts())
      .put(showToast(getPickItemAsFavoriteFailureToast(item), 'bottom center'))
      .dispatch(pickItemAsFavoriteFailure(item, error))
      .silentRun()
  })
})

describe('when handling the success of unpicking a favorite item', () => {
  it('should show a toast signaling the success ', () => {
    const item = {} as Item
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(hideAllToasts())
      .put(
        showToast(getUnpickItemAsFavoriteSuccessToast(item), 'bottom center')
      )
      .dispatch(unpickItemAsFavoriteSuccess(item))
      .silentRun()
  })
})

describe('when handling the failure of unpicking a favorite item', () => {
  it('should show a toast signaling the failure ', () => {
    const item = {} as Item
    const error = 'anError'
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(hideAllToasts())
      .put(
        showToast(getUnpickItemAsFavoriteFailureToast(item), 'bottom center')
      )
      .dispatch(unpickItemAsFavoriteFailure(item, error))
      .silentRun()
  })
})

describe('when handling the success of updating a list', () => {
  let list: UpdateOrCreateList
  beforeEach(() => {
    list = {
      name: 'aListName'
    } as UpdateOrCreateList
  })

  it('should show a toast signaling the success of the list update', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(showToast(getUpdateListSuccessToast(list), 'bottom center'))
      .dispatch(updateListSuccess(list))
      .silentRun()
  })
})

describe('when handling the success of deleting a list', () => {
  let list: List
  beforeEach(() => {
    list = {
      name: 'aListName'
    } as List
  })

  it('should show a toast signaling the success of the list deletion', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(showToast(getDeleteListSuccessToast(list), 'bottom center'))
      .dispatch(deleteListSuccess(list))
      .silentRun()
  })
})

describe('when handling the failure of deleting a list', () => {
  let list: List
  beforeEach(() => {
    list = {
      name: 'aListName'
    } as List
  })

  it('should show a toast signaling the failure of the list deletion', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(showToast(getDeleteListFailureToast(list), 'bottom center'))
      .dispatch(deleteListFailure(list, error))
      .silentRun()
  })
})

describe('when handling a put into the toastDispatchableActionsChannel', () => {
  it('should hide all the previous rendered toasts and dispatch the given action', () => {
    const item = {} as Item
    toastDispatchableActionsChannel.put(pickItemAsFavoriteRequest(item))

    return expectSaga(toastSaga)
      .put(pickItemAsFavoriteRequest(item))
      .put(hideAllToasts())
      .silentRun()
  })
})

const error = 'anError'
const actions: [string, FetchItemsFailureAction | FetchNFTsFailureAction][] = [
  ['items', fetchItemsFailure(error, {} as ItemBrowseOptions)],
  ['NFTs', fetchNFTsFailure({} as NFTsFetchOptions, error, 123456789)]
]

describe.each(actions)(
  'when handling the failure of fetching %s',
  (_, action) => {
    it('should show a toast signaling the failure ', () => {
      return expectSaga(toastSaga)
        .provide([[select(getState), []]])
        .put(showToast(getFetchAssetsFailureToast(error), 'bottom right'))
        .dispatch(action)
        .silentRun()
    })
  }
)

describe('when handling the success of a bulk pick and unpick action', () => {
  let item: Item
  let pickedFor: List[]
  let unpickedFrom: List[]

  beforeEach(() => {
    item = {
      id: 'anItemId'
    } as Item
    pickedFor = [{ id: 'aListId' } as List]
    unpickedFrom = [{ id: 'anotherListId' } as List]
  })

  it('should hide all toasts and show a success toast', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(hideAllToasts())
      .put(
        showToast(
          getBulkPickItemSuccessToast(item, pickedFor, unpickedFrom),
          'bottom center'
        )
      )
      .dispatch(
        bulkPickUnpickSuccess(item, pickedFor, unpickedFrom, true, true)
      )
      .silentRun()
  })
})

describe('when handling the failure of a bulk pick and unpick action', () => {
  let item: Item
  let pickedFor: List[]
  let unpickedFrom: List[]

  beforeEach(() => {
    item = {
      id: 'anItemId'
    } as Item
    pickedFor = [{ id: 'aListId' } as List]
    unpickedFrom = [{ id: 'anotherListId' } as List]
  })

  it('should hide all toasts and show a failure toast', () => {
    return expectSaga(toastSaga)
      .provide([[select(getState), []]])
      .put(hideAllToasts())
      .put(
        showToast(
          getBulkPickItemFailureToast(item, pickedFor, unpickedFrom),
          'bottom center'
        )
      )
      .dispatch(
        bulkPickUnpickFailure(item, pickedFor, unpickedFrom, 'anErrorMessage')
      )
      .silentRun()
  })
})
