import { Item } from '@dcl/schemas'
import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/react'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { FavoritesAPI } from '../../../modules/vendor/decentraland/favorites/api'
import { ListOfLists } from '../../../modules/vendor/decentraland/favorites'
import { renderWithProviders } from '../../../utils/test'
import {
  CREATE_LIST_BUTTON_DATA_TEST_ID,
  SAVE_BUTTON_DATA_TEST_ID,
  LISTS_LOADER_DATA_TEST_ID,
  LIST_CHECKBOX,
  LIST_NAME,
  LIST_PRIVATE
} from './constants'
import SaveToListModal from './SaveToListModal'
import { Props } from './SaveToListModal.types'

jest.mock('react-virtualized-auto-sizer', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: any }) => {
      return children({ width: 100, height: 100 })
    }
  }
})

function renderSaveToListModalModal(props: Partial<Props> = {}) {
  return renderWithProviders(
    <SaveToListModal
      name={'A name'}
      metadata={{ item: { id: 'anItemId' } as Item }}
      identity={{} as AuthIdentity}
      isSavingPicks={false}
      onCreateList={jest.fn()}
      onSavePicks={jest.fn()}
      onClose={jest.fn()}
      onFinishListCreation={jest.fn()}
      {...props}
    />,
    {
      preloadedState: {
        modal: {}
      }
    }
  )
}
let item: Item
let renderedModal: ReturnType<typeof renderSaveToListModalModal>

describe('when loading the component', () => {
  beforeEach(() => {
    item = { id: 'anItemId' } as Item
  })

  describe('and the list fetching fails', () => {
    beforeEach(async () => {
      jest
        .spyOn(FavoritesAPI.prototype, 'getLists')
        .mockRejectedValueOnce(new Error('An error'))
      await act(async () => {
        renderedModal = renderSaveToListModalModal({ metadata: { item } })
      })
    })

    it('should display an error message with the error', () => {
      const { getByText } = renderedModal
      expect(getByText('An error')).toBeInTheDocument()
    })
  })

  describe('and the list fetching succeeds', () => {
    let lists: ListOfLists[]

    beforeEach(async () => {
      lists = [
        {
          id: 'aListId',
          name: 'aListName',
          itemsCount: 1,
          isPrivate: true,
          isItemInList: true,
          previewOfItemIds: []
        },
        {
          id: 'anotherListId',
          name: 'anotherListName',
          itemsCount: 2,
          isPrivate: false,
          isItemInList: false,
          previewOfItemIds: []
        }
      ]

      jest.spyOn(FavoritesAPI.prototype, 'getLists').mockResolvedValueOnce({
        results: lists,
        total: 2
      })
      await act(async () => {
        renderedModal = renderSaveToListModalModal({ metadata: { item } })
      })
    })

    it('should not show the loader', () => {
      const { queryByTestId } = renderedModal
      expect(queryByTestId(LISTS_LOADER_DATA_TEST_ID)).not.toBeInTheDocument()
    })

    it('should show the private tag in the loaded list if the lists are private', () => {
      const { queryByTestId, getByTestId } = renderedModal
      expect(getByTestId(LIST_PRIVATE + lists[0].id)).toBeInTheDocument()
      expect(queryByTestId(LIST_PRIVATE + lists[1].id)).not.toBeInTheDocument()
    })

    it('should show the list names and items count', () => {
      const { getByTestId } = renderedModal
      expect(getByTestId(LIST_NAME + lists[0].id)).toBeInTheDocument()
      expect(getByTestId(LIST_NAME + lists[1].id)).toBeInTheDocument()
    })

    it('should show the lists checked if the item is the list', () => {
      const { getByTestId } = renderedModal
      expect(getByTestId(LIST_CHECKBOX + lists[0].id).children[0]).toBeChecked()
      expect(
        getByTestId(LIST_CHECKBOX + lists[1].id).children[0]
      ).not.toBeChecked()
    })
  })
})

describe('when clicking on the create list button', () => {
  let onCreateList: jest.Mock

  beforeEach(async () => {
    onCreateList = jest.fn()
    jest.spyOn(FavoritesAPI.prototype, 'getLists').mockResolvedValueOnce({
      results: [],
      total: 0
    })
    await act(async () => {
      renderedModal = renderSaveToListModalModal({ onCreateList })
    })
  })

  it('should call the onCreateList prop callback', () => {
    const { getByTestId } = renderedModal

    fireEvent.click(getByTestId(CREATE_LIST_BUTTON_DATA_TEST_ID))

    expect(onCreateList).toHaveBeenCalled()
  })
})

describe('when saving the picks', () => {
  let lists: ListOfLists[]
  beforeEach(async () => {
    lists = [
      {
        id: 'aListId',
        name: 'aListName',
        itemsCount: 1,
        isPrivate: true,
        isItemInList: true,
        previewOfItemIds: []
      }
    ]
    jest.spyOn(FavoritesAPI.prototype, 'getLists').mockResolvedValueOnce({
      results: lists,
      total: 1
    })

    await act(async () => {
      renderedModal = renderSaveToListModalModal({ isSavingPicks: true })
    })
  })

  it('should disable the save and create list buttons', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_LIST_BUTTON_DATA_TEST_ID)).toBeDisabled()
    expect(getByTestId(SAVE_BUTTON_DATA_TEST_ID)).toBeDisabled()
  })

  it('should disable any list checkbox', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(LIST_CHECKBOX + lists[0].id).children[0]).toBeDisabled()
  })

  it('should set the loading save button as loading', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(LIST_CHECKBOX + lists[0].id).children[0]).toBeChecked()
    expect(getByTestId(SAVE_BUTTON_DATA_TEST_ID)).toHaveClass('loading')
  })
})
