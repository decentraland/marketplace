import { BodyShape, Item, Rarity, WearableCategory } from '@dcl/schemas'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/test'
import { List } from '../../../modules/favorites/types'
import {
  DELETE_LIST_DATA_TEST_ID,
  EDIT_LIST_DATA_TEST_ID,
  EMPTY_PREVIEW_DATA_TEST_ID,
  GRID_PREVIEW_DATA_TEST_ID,
  ITEM_COUNT_DATA_TEST_ID,
  LIST_NAME_DATA_TEST_ID,
  default as ListCard,
  PRIVATE_DATA_TEST_ID
} from './ListCard'
import { Props } from './ListCard.types'

function renderListCard(props: Partial<Props> = {}) {
  return renderWithProviders(
    <ListCard
      list={{
        id: 'aListId',
        name: 'aListName',
        isPrivate: false,
        itemsCount: 0
      }}
      items={[]}
      onDeleteList={jest.fn()}
      onEditList={jest.fn()}
      {...props}
    />
  )
}

let item: Item
let renderedModal: ReturnType<typeof renderListCard>

beforeEach(() => {
  item = {
    id: 'anItemId',
    thumbnail: 'http://some-thumbnail-url.com',
    data: {
      wearable: {
        description: 'aDescription',
        category: WearableCategory.EARRING,
        rarity: Rarity.MYTHIC,
        bodyShapes: [BodyShape.MALE, BodyShape.FEMALE],
        isSmart: false
      }
    }
  } as Item
})

describe('when rendering the ListCard with a list with no items', () => {
  beforeEach(() => {
    renderedModal = renderListCard({ items: [] })
  })

  it('should show the "no items" preview', () => {
    expect(
      renderedModal.getByTestId(EMPTY_PREVIEW_DATA_TEST_ID)
    ).toBeInTheDocument()
  })
})

describe.each([1, 2, 3, 4])(
  'when rendering the ListCard with %i items',
  count => {
    beforeEach(() => {
      renderedModal = renderListCard({
        items: Array.from({ length: count }, (_v, i) => ({
          ...item,
          id: `item-${i}`
        }))
      })
    })

    it(`should show the grid preview with the grid class "grid-${count}"`, () => {
      expect(renderedModal.getByTestId(GRID_PREVIEW_DATA_TEST_ID)).toHaveClass(
        `grid-${count}`
      )
    })

    it('should render an image for each item', () => {
      expect(
        renderedModal.getByTestId(GRID_PREVIEW_DATA_TEST_ID).childElementCount
      ).toBe(count)
    })

    it('should not show the "no items" preview', () => {
      expect(
        renderedModal.queryByTestId(EMPTY_PREVIEW_DATA_TEST_ID)
      ).not.toBeInTheDocument()
    })
  }
)

describe('when rendering the ListCard', () => {
  let list: List

  beforeEach(() => {
    list = {
      name: 'aListName',
      itemsCount: 4
    } as List
    renderedModal = renderListCard({ list })
  })

  it('should render the list name', () => {
    expect(renderedModal.getByTestId(LIST_NAME_DATA_TEST_ID)).toHaveTextContent(
      list.name
    )
  })

  it('should render the amount of items', () => {
    expect(
      renderedModal.getByTestId(ITEM_COUNT_DATA_TEST_ID)
    ).toHaveTextContent(`${list.itemsCount} items`)
  })
})

describe('when rendering the ListCard with a private list', () => {
  let list: List

  beforeEach(() => {
    list = {
      name: 'aListName',
      itemsCount: 4,
      isPrivate: true
    } as List
    renderedModal = renderListCard({ list })
  })

  it('should render the private tag', () => {
    expect(renderedModal.getByTestId(PRIVATE_DATA_TEST_ID)).toBeInTheDocument()
  })
})

describe('when rendering the ListCard with a public list', () => {
  let list: List

  beforeEach(() => {
    list = {
      name: 'aListName',
      itemsCount: 4,
      isPrivate: false
    } as List
    renderedModal = renderListCard({ list })
  })

  it('should not render the private tag', () => {
    expect(
      renderedModal.queryByTestId(PRIVATE_DATA_TEST_ID)
    ).not.toBeInTheDocument()
  })
})

describe('when clicking the edit list button', () => {
  let list: List
  let onEditList: jest.Mock

  beforeEach(() => {
    onEditList = jest.fn()
    list = {
      name: 'aListName',
      itemsCount: 4
    } as List
    renderedModal = renderListCard({ list, onEditList })
  })

  it('should call the onEditList prop callback', () => {
    fireEvent.click(renderedModal.getByTestId(EDIT_LIST_DATA_TEST_ID))
    expect(onEditList).toHaveBeenCalled()
  })
})

describe('when clicking the delete list button', () => {
  let list: List
  let onDeleteList: jest.Mock

  beforeEach(() => {
    onDeleteList = jest.fn()
    list = {
      name: 'aListName',
      itemsCount: 4
    } as List
    renderedModal = renderListCard({ list, onDeleteList })
  })

  it('should call the onDeleteList prop callback', () => {
    fireEvent.click(renderedModal.getByTestId(DELETE_LIST_DATA_TEST_ID))
    expect(onDeleteList).toHaveBeenCalled()
  })
})
