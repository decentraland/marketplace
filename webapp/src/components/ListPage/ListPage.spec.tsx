import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../utils/test'
import { List } from '../../modules/favorites/types'
import ListPage, {
  LOADER_TEST_ID,
  EMPTY_VIEW_TEST_ID,
  ASSET_BROWSE_TEST_ID,
  LIST_CONTAINER_TEST_ID,
  PRIVATE_BADGE_TEST_ID,
  UPDATED_AT_TEST_ID,
  SHARE_LIST_BUTTON_TEST_ID,
  EDIT_LIST_BUTTON_TEST_ID,
  DELETE_LIST_BUTTON_TEST_ID
} from './ListPage'
import { Props } from './ListPage.types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

const listId = 'aListId'
let list: List = {
  id: listId,
  name: 'aListName',
  description: 'aListDescription',
  isPrivate: false
} as List

function renderListPage(props: Partial<Props> = {}) {
  return renderWithProviders(
    <ListPage
      wallet={{} as Wallet}
      listId={listId}
      list={list}
      onBack={jest.fn()}
      onFetchList={jest.fn()}
      onDeleteList={jest.fn()}
      onEditList={jest.fn()}
      onShareList={jest.fn()}
      isLoading={false}
      history={{} as any}
      location={{} as any}
      match={{} as any}
      {...props}
    />
  )
}

let renderedPage: ReturnType<typeof renderListPage>

describe('when rendering the ListPage without a fetched list because it is being loaded', () => {
  beforeEach(() => {
    renderedPage = renderListPage({ list: undefined, isLoading: true })
  })

  it('should show the loader', () => {
    expect(renderedPage.getByTestId(LOADER_TEST_ID)).toBeInTheDocument()
  })
})

describe('when rendering the ListPage with a loaded list', () => {
  it('should show the list container', () => {
    renderedPage = renderListPage()
    expect(renderedPage.getByTestId(LIST_CONTAINER_TEST_ID)).toBeInTheDocument()
  })

  describe('when the updated at is set', () => {
    beforeEach(() => {
      renderedPage = renderListPage({
        list: {
          ...list,
          updatedAt: Number(new Date().setDate(new Date().getDate() - 1))
        }
      })
    })

    it('should show the last time the list was updated', () => {
      expect(renderedPage.getByTestId(UPDATED_AT_TEST_ID)).toBeInTheDocument()
    })

    it('should transform the date into something like: "dd time ago"', () => {
      expect(renderedPage.getByTestId(UPDATED_AT_TEST_ID)).toHaveTextContent(
        '1 day ago'
      )
    })
  })

  describe('and the list is private', () => {
    beforeEach(() => {
      renderedPage = renderListPage({ list: { ...list, isPrivate: true } })
    })

    it('should show the private badge', () => {
      expect(
        renderedPage.getByTestId(PRIVATE_BADGE_TEST_ID)
      ).toBeInTheDocument()
    })

    it('should disable the share list button', () => {
      expect(renderedPage.getByTestId(SHARE_LIST_BUTTON_TEST_ID)).toBeDisabled()
    })
  })

  describe('and the list is public', () => {
    beforeEach(() => {
      renderedPage = renderListPage({ list: { ...list, isPrivate: false } })
    })

    it('should hide the private badge', () => {
      expect(renderedPage.queryByTestId(PRIVATE_BADGE_TEST_ID)).toBeNull()
    })

    it('should enable the share list button', () => {
      expect(renderedPage.getByTestId(SHARE_LIST_BUTTON_TEST_ID)).toBeEnabled()
    })
  })
})

describe('when rendering the ListPage but the wallet has not been yet fetched', () => {
  beforeEach(() => {
    renderedPage = renderListPage({ wallet: undefined })
  })

  it('should show the empty view', () => {
    expect(renderedPage.getByTestId(EMPTY_VIEW_TEST_ID)).toBeInTheDocument()
  })
})

describe('when rendering the ListPage with a valid connected wallet', () => {
  beforeEach(() => {
    renderedPage = renderListPage()
  })

  it('should show the empty view', () => {
    expect(renderedPage.getByTestId(ASSET_BROWSE_TEST_ID)).toBeInTheDocument()
  })
})

describe('when clicking the share list button', () => {
  let onShareList: jest.Mock

  beforeEach(() => {
    onShareList = jest.fn()
    renderedPage = renderListPage({ onShareList })
  })

  it('should call the onShareList prop callback', () => {
    fireEvent.click(renderedPage.getByTestId(SHARE_LIST_BUTTON_TEST_ID))
    expect(onShareList).toHaveBeenCalledWith(list)
  })
})

describe('when clicking the edit list button', () => {
  let onEditList: jest.Mock

  beforeEach(() => {
    onEditList = jest.fn()
    renderedPage = renderListPage({ onEditList })
  })

  it('should call the onEditList prop callback', () => {
    fireEvent.click(renderedPage.getByTestId(EDIT_LIST_BUTTON_TEST_ID))
    expect(onEditList).toHaveBeenCalledWith(list)
  })
})

describe('when clicking the delete list button', () => {
  let onDeleteList: jest.Mock

  beforeEach(() => {
    onDeleteList = jest.fn()
    renderedPage = renderListPage({ onDeleteList })
  })

  it('should call the onDeleteList prop callback', () => {
    fireEvent.click(renderedPage.getByTestId(DELETE_LIST_BUTTON_TEST_ID))
    expect(onDeleteList).toHaveBeenCalledWith(listId)
  })
})