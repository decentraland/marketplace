import { fireEvent } from '@testing-library/react'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../utils/test'
import { List } from '../../modules/favorites/types'
import { DEFAULT_FAVORITES_LIST_ID } from '../../modules/vendor/decentraland/favorites'
import ListPage from './ListPage'
import {
  LOADER_TEST_ID,
  EMPTY_LIST_TEST_ID,
  ASSET_BROWSE_TEST_ID,
  LIST_CONTAINER_TEST_ID,
  PRIVATE_BADGE_TEST_ID,
  UPDATED_AT_TEST_ID,
  SHARE_LIST_BUTTON_TEST_ID,
  EDIT_LIST_BUTTON_TEST_ID,
  DELETE_LIST_BUTTON_TEST_ID,
  ERROR_CONTAINER_TEST_ID,
  COULD_NOT_LOAD_LIST_ACTION_TEST_ID,
  GO_BACK_BUTTON_TEST_ID,
  EMPTY_LIST_ACTION_TEST_ID
} from './constants'
import { Props } from './ListPage.types'

// This is to avoid errors with the canvas
jest.mock('../LinkedProfile', () => {
  return {
    LinkedProfile: () => <div data-testid="linked-profile" />
  }
})

const listId = 'aListId'
let list: List = {
  id: listId,
  name: 'aListName',
  description: 'aListDescription',
  isPrivate: false,
  userAddress: '0x123owner'
} as List

function renderListPage(props: Partial<Props> = {}) {
  return renderWithProviders(
    <ListPage
      isConnecting={false}
      wallet={{ address: list.userAddress } as Wallet}
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
      error={null}
      isListV1Enabled={true}
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
    describe('and the viewer is the owner', () => {
      beforeEach(() => {
        renderedPage = renderListPage({ list: { ...list, isPrivate: false } })
      })

      it('should hide the private badge', () => {
        expect(renderedPage.queryByTestId(PRIVATE_BADGE_TEST_ID)).toBeNull()
      })

      it('should enable the share list button', () => {
        expect(
          renderedPage.getByTestId(SHARE_LIST_BUTTON_TEST_ID)
        ).toBeEnabled()
      })

      it('should show the go back button', () => {
        expect(
          renderedPage.getByTestId(GO_BACK_BUTTON_TEST_ID)
        ).toBeInTheDocument()
      })

      it('should show the edit button', () => {
        expect(
          renderedPage.getByTestId(EDIT_LIST_BUTTON_TEST_ID)
        ).toBeInTheDocument()
      })

      it('should show the delete button', () => {
        expect(
          renderedPage.getByTestId(DELETE_LIST_BUTTON_TEST_ID)
        ).toBeInTheDocument()
      })
    })

    describe('and the viewer is not the owner', () => {
      beforeEach(() => {
        renderedPage = renderListPage({
          list: {
            ...list,
            isPrivate: false
          },
          wallet: { address: '0xnnotanowner123' } as Wallet
        })
      })

      it.each([
        ['go back', GO_BACK_BUTTON_TEST_ID],
        ['share list', SHARE_LIST_BUTTON_TEST_ID],
        ['edit list', EDIT_LIST_BUTTON_TEST_ID],
        ['delete list', DELETE_LIST_BUTTON_TEST_ID]
      ])('should hide the %s button', (_, testId) => {
        expect(renderedPage.queryByTestId(testId)).toBeNull()
      })

      it('should show the owner profile ', () => {
        expect(renderedPage.getByTestId('linked-profile')).toBeInTheDocument()
      })
    })
  })

  describe('and the list is the default', () => {
    describe('when the lists feature flag is on', () => {
      beforeEach(() => {
        renderedPage = renderListPage({
          list: { ...list, id: DEFAULT_FAVORITES_LIST_ID },
          isListV1Enabled: true
        })
      })

      it('should hide the share list button', () => {
        expect(renderedPage.queryByTestId(SHARE_LIST_BUTTON_TEST_ID)).toBeNull()
      })

      it('should hide the edit list button', () => {
        expect(renderedPage.queryByTestId(EDIT_LIST_BUTTON_TEST_ID)).toBeNull()
      })

      it('should hide the delete list button', () => {
        expect(
          renderedPage.queryByTestId(DELETE_LIST_BUTTON_TEST_ID)
        ).toBeNull()
      })
    })

    describe('when the lists feature flag is off', () => {
      beforeEach(() => {
        renderedPage = renderListPage({
          list: { ...list, id: DEFAULT_FAVORITES_LIST_ID },
          isListV1Enabled: false
        })
      })

      it('should hide the go back button', () => {
        expect(renderedPage.queryByTestId(GO_BACK_BUTTON_TEST_ID)).toBeNull()
      })
    })
  })
})

describe('when rendering the ListPage with an empty list', () => {
  describe('and the list is public', () => {
    describe('and the viewer is the owner', () => {
      beforeEach(() => {
        renderedPage = renderListPage({
          list: {
            ...list,
            itemsCount: 0,
            isPrivate: false
          }
        })
      })

      it('should render the empty list message', () => {
        expect(renderedPage.getByTestId(EMPTY_LIST_TEST_ID)).toBeInTheDocument()
        expect(
          renderedPage.getByText(t('list_page.empty.owner.title'))
        ).toBeInTheDocument()
        expect(
          renderedPage.getByText(t('list_page.empty.owner.subtitle'))
        ).toBeInTheDocument()
        expect(
          renderedPage.getByTestId(EMPTY_LIST_ACTION_TEST_ID)
        ).toBeInTheDocument()
      })
    })

    describe('and the viewer is not the owner', () => {
      beforeEach(() => {
        renderedPage = renderListPage({
          list: {
            ...list,
            itemsCount: 0,
            isPrivate: false
          },
          wallet: { address: '0xnnotanowner123' } as Wallet
        })
      })

      it('should render the empty list message', () => {
        expect(renderedPage.getByTestId(EMPTY_LIST_TEST_ID)).toBeInTheDocument()
        expect(
          renderedPage.getByText(t('list_page.empty.public.title'))
        ).toBeInTheDocument()
        expect(
          renderedPage.getByText(t('list_page.empty.public.subtitle'))
        ).toBeInTheDocument()
        expect(renderedPage.queryByTestId(EMPTY_LIST_ACTION_TEST_ID)).toBeNull()
      })
    })

    describe('and the viewer is not logged in', () => {
      beforeEach(() => {
        renderedPage = renderListPage({
          list: {
            ...list,
            itemsCount: 0,
            isPrivate: false
          },
          wallet: null
        })
      })

      it('should render the empty list message', () => {
        expect(renderedPage.getByTestId(EMPTY_LIST_TEST_ID)).toBeInTheDocument()
        expect(
          renderedPage.getByText(t('list_page.empty.public.title'))
        ).toBeInTheDocument()
        expect(
          renderedPage.getByText(t('list_page.empty.public.subtitle'))
        ).toBeInTheDocument()
        expect(renderedPage.queryByTestId(EMPTY_LIST_ACTION_TEST_ID)).toBeNull()
      })
    })
  })

  describe('and the list is private', () => {
    beforeEach(() => {
      renderedPage = renderListPage({
        list: {
          ...list,
          itemsCount: 0,
          isPrivate: true
        }
      })
    })

    it('should render the correct empty list message with the action button', () => {
      expect(renderedPage.getByTestId(EMPTY_LIST_TEST_ID)).toBeInTheDocument()
      expect(
        renderedPage.getByText(t('list_page.empty.owner.title'))
      ).toBeInTheDocument()
      expect(
        renderedPage.getByText(t('list_page.empty.owner.subtitle'))
      ).toBeInTheDocument()
      expect(
        renderedPage.getByTestId(EMPTY_LIST_ACTION_TEST_ID)
      ).toBeInTheDocument()
    })
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
    expect(onDeleteList).toHaveBeenCalledWith(list)
  })
})

describe("when the list doesn't exist", () => {
  beforeEach(() => {
    renderedPage = renderListPage({
      list: undefined,
      error: 'The list was not found.'
    })
  })

  it('should show the error message', () => {
    expect(
      renderedPage.getByTestId(ERROR_CONTAINER_TEST_ID)
    ).toBeInTheDocument()

    expect(
      renderedPage.getByText(t('list_page.error.not_found.title'))
    ).toBeInTheDocument()
    expect(
      renderedPage.getByText(t('list_page.error.not_found.subtitle'))
    ).toBeInTheDocument()
  })
})

describe('when the list retrieval fails', () => {
  it('should show the error message', () => {
    renderedPage = renderListPage({
      list: undefined,
      error: 'Could not retrieve the list from the server.'
    })

    expect(
      renderedPage.getByTestId(ERROR_CONTAINER_TEST_ID)
    ).toBeInTheDocument()

    expect(
      renderedPage.getByText(t('list_page.error.could_not_load.title'))
    ).toBeInTheDocument()
    expect(
      renderedPage.getByText(t('list_page.error.could_not_load.subtitle'))
    ).toBeInTheDocument()
    expect(
      renderedPage.getByText(t('list_page.error.could_not_load.action'))
    ).toBeInTheDocument()
  })

  describe('when clicking the action button', () => {
    let onFetchList: jest.Mock

    beforeEach(() => {
      onFetchList = jest.fn()
      renderedPage = renderListPage({
        list: undefined,
        error: 'Could not retrieve the list from the server.',
        onFetchList
      })
    })

    it('should call the onFetchList prop callback', () => {
      fireEvent.click(
        renderedPage.getByTestId(COULD_NOT_LOAD_LIST_ACTION_TEST_ID)
      )
      expect(onFetchList).toHaveBeenCalledWith(listId)
    })
  })
})
