import { fireEvent } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../utils/test'
import { List } from '../../modules/favorites/types'
import ListsPage from './ListsPage'
import { LOADER_TEST_ID, ERROR_TEST_ID, CREATE_LIST_TEST_ID } from './constants'
import { Props } from './ListsPage.types'

function renderListsPage(props: Partial<Props> = {}) {
  return renderWithProviders(
    <ListsPage isLoading={false} lists={[]} count={0} error={null} onFetchLists={jest.fn()} onCreateList={jest.fn()} {...props} />
  )
}

let renderedPage: ReturnType<typeof renderListsPage>
let lists: List[]

beforeEach(() => {
  lists = Array.from(
    { length: 5 },
    (_e, i) =>
      ({
        id: i.toString(),
        name: 'aListName',
        itemsCount: 1,
        previewOfItemIds: []
      }) as List
  )
})

describe('when rendering the ListsPage with the request loading', () => {
  beforeEach(() => {
    renderedPage = renderListsPage({ isLoading: true })
  })

  it('should show the loader', () => {
    expect(renderedPage.getByTestId(LOADER_TEST_ID)).toBeInTheDocument()
  })
})

describe('when rendering the ListsPage with an error', () => {
  beforeEach(() => {
    renderedPage = renderListsPage({ error: 'Could not load lists' })
  })

  it('should show the error view', () => {
    expect(renderedPage.getByTestId(ERROR_TEST_ID)).toBeInTheDocument()
  })
})

describe('when clicking the create list button', () => {
  let onCreateList: jest.Mock

  beforeEach(() => {
    onCreateList = jest.fn()
    renderedPage = renderListsPage({ onCreateList, lists })
  })

  it('should call the onCreateList prop callback', () => {
    fireEvent.click(renderedPage.getByTestId(CREATE_LIST_TEST_ID))
    expect(onCreateList).toHaveBeenCalled()
  })
})

describe('when rendering the ListsPage with 5 lists', () => {
  const count = 5
  beforeEach(() => {
    renderedPage = renderListsPage({
      count,
      lists
    })
  })

  it('should show the list of lists', () => {
    expect(renderedPage.getByText(t('lists_page.subtitle', { count }))).toBeInTheDocument()
  })
})
