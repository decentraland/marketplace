import { fireEvent } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { List } from '../../modules/favorites/types'
import { renderWithProviders } from '../../utils/test'
import { LOADER_TEST_ID, ERROR_TEST_ID, CREATE_LIST_TEST_ID } from './constants'
import ListsPage from './ListsPage'
import { Props } from './ListsPage.types'

let mockObservers: MockIntersectionObserver[] = []

class MockIntersectionObserver implements IntersectionObserver {
  root: Element | Document | null = null
  rootMargin: string = ''
  thresholds: ReadonlyArray<number> = []
  callback: IntersectionObserverCallback
  elements: Element[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    mockObservers.push(this)
  }

  observe(element: Element) {
    this.elements.push(element)
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter(el => el !== element)
  }

  disconnect() {
    this.elements = []
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  // Helper method to simulate intersection
  triggerIntersect(isIntersecting = true) {
    const entries = this.elements.map(element => ({
      isIntersecting,
      target: element,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      boundingClientRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0
    })) as IntersectionObserverEntry[]

    this.callback(entries, this)
  }
}

beforeAll(() => {
  // Properly cast IntersectionObserver to avoid TS warnings
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
})

beforeEach(() => {
  mockObservers = []
})

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
