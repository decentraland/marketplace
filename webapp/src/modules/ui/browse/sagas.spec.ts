import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { Item } from '@dcl/schemas'
import { getPageNumber } from '../../routing/selectors'
import { FETCH_FAVORITED_ITEMS_REQUEST, bulkPickUnpickSuccess, fetchFavoritedItemsRequest } from '../../favorites/actions'
import { isOwnerUnpickingFromCurrentList } from '../../favorites/selectors'
import { PAGE_SIZE } from '../../vendor/api'
import { getCount, getItemsPickedByUserOrCreator } from './selectors'
import { browseSaga } from './sagas'
import { ListOfLists } from '../../vendor/decentraland/favorites'

describe('when handling the success action of a bulk item pick and unpick', () => {
  let list: ListOfLists
  let pickedStateItems: Item[]
  let count: number

  beforeEach(() => {
    list = {
      id: 'aListId',
      userAddress: 'anAddress'
    } as unknown as ListOfLists
  })

  describe('and the length of the loaded favorites is less than the length of the total existing favorites', () => {
    let unpickedFrom: ListOfLists[]

    beforeEach(() => {
      pickedStateItems = [{} as Item]
      count = 2
    })

    describe('and the unpicked item is from the current list', () => {
      beforeEach(() => {
        unpickedFrom = [list]
      })

      it('should put an action to fetch the last item of the loaded page to replace the unpicked item', () => {
        return expectSaga(browseSaga)
          .provide([
            [select(getPageNumber), 1],
            [select(isOwnerUnpickingFromCurrentList, unpickedFrom), true],
            [select(getItemsPickedByUserOrCreator), pickedStateItems],
            [select(getCount), count]
          ])
          .put(
            fetchFavoritedItemsRequest(
              {
                filters: { first: 1, skip: PAGE_SIZE - 1 }
              },
              true
            )
          )
          .dispatch(bulkPickUnpickSuccess({} as Item, [], unpickedFrom, true, true))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the unpicked item is not from the current list', () => {
      beforeEach(() => {
        unpickedFrom = [{ id: 'anotherListId' } as ListOfLists]
      })

      it('should not put the fetch favorited items request action', () => {
        return expectSaga(browseSaga)
          .provide([
            [select(getPageNumber), 1],
            [select(isOwnerUnpickingFromCurrentList, unpickedFrom), false],
            [select(getItemsPickedByUserOrCreator), pickedStateItems],
            [select(getCount), count]
          ])
          .not.put.like({ action: { type: FETCH_FAVORITED_ITEMS_REQUEST } })
          .dispatch(bulkPickUnpickSuccess({} as Item, [], unpickedFrom, true, true))
          .run({ silenceTimeout: true })
      })
    })
  })

  describe('and the length of the loaded favorites is equal than the length of the total existing favorites', () => {
    beforeEach(() => {
      pickedStateItems = [{} as Item, {} as Item]
      count = 2
    })

    it('should not put the fetch favorited items request action', () => {
      return expectSaga(browseSaga)
        .provide([
          [select(getPageNumber), 1],
          [select(isOwnerUnpickingFromCurrentList, [list]), true],
          [select(getItemsPickedByUserOrCreator), pickedStateItems],
          [select(getCount), count]
        ])
        .not.put.like({ action: { type: FETCH_FAVORITED_ITEMS_REQUEST } })
        .dispatch(bulkPickUnpickSuccess({} as Item, [], [list], true, true))
        .run({ silenceTimeout: true })
    })
  })
})
