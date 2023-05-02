import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga/effects'
import { Item } from '@dcl/schemas'
import { Section } from '../../vendor/decentraland/routing'
import { getPageNumber, getSection } from '../../routing/selectors'
import {
  FETCH_FAVORITED_ITEMS_REQUEST,
  fetchFavoritedItemsRequest,
  unpickItemAsFavoriteSuccess
} from '../../favorites/actions'
import { PAGE_SIZE } from '../../vendor/api'
import { View } from '../types'
import { getCount, getItemsPickedByUser } from './selectors'
import { browseSaga } from './sagas'

describe('when handling the success action of unpicking an item as favorite', () => {
  let section: Section

  describe('and the section is not LISTS', () => {
    beforeEach(() => {
      section = Section.EMOTES
    })

    it('should not put the fetch favorited items request action', () => {
      return expectSaga(browseSaga)
        .provide([
          [select(getSection), section],
          [select(getPageNumber), 1],
          [select(getItemsPickedByUser), []],
          [select(getCount), 2]
        ])
        .not.put.like({ action: { type: FETCH_FAVORITED_ITEMS_REQUEST } })
        .dispatch(unpickItemAsFavoriteSuccess({} as Item))
        .run({ silenceTimeout: true })
    })
  })

  describe('and the section is LISTS', () => {
    let pickedItems: Item[]

    beforeEach(() => {
      section = Section.LISTS
    })

    describe('and the length of the loaded favorites is less than the length of the total existing favorites', () => {
      beforeEach(() => {
        pickedItems = []
      })

      it('should put an action to fetch the last item of the loaded page to replace the unpicked item', () => {
        return expectSaga(browseSaga)
          .provide([
            [select(getSection), section],
            [select(getPageNumber), 1],
            [select(getItemsPickedByUser), pickedItems],
            [select(getCount), 2]
          ])
          .put(
            fetchFavoritedItemsRequest({
              filters: { first: 1, skip: PAGE_SIZE - 1 },
              page: 1,
              section: Section.LISTS
            })
          )
          .dispatch(unpickItemAsFavoriteSuccess({} as Item))
          .run({ silenceTimeout: true })
      })
    })

    describe('and the length of the loaded favorites is greater or equal than the length of the total existing favorites', () => {
      beforeEach(() => {
        pickedItems = [{} as Item, {} as Item]
      })

      it('should not put the fetch favorited items request action', () => {
        return expectSaga(browseSaga)
          .provide([
            [select(getSection), section],
            [select(getPageNumber), 1],
            [select(getItemsPickedByUser), pickedItems],
            [select(getCount), 2]
          ])
          .not.put.like({ action: { type: FETCH_FAVORITED_ITEMS_REQUEST } })
          .dispatch(unpickItemAsFavoriteSuccess({} as Item))
          .run({ silenceTimeout: true })
      })
    })
  })
})
