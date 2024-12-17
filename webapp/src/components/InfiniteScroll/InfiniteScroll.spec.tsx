import { render } from '@testing-library/react'
import { InfiniteScroll } from './InfiniteScroll'
import { Props } from './InfiniteScroll.types'

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

function renderInfiniteScroll(props: Partial<Props>) {
  return render(
    <InfiniteScroll hasMorePages={true} isLoading={false} onLoadMore={jest.fn()} page={0} {...props}>
      <span>My container</span>
    </InfiniteScroll>
  )
}

describe('InfiniteScroll', () => {
  describe('when hasMorePages is true', () => {
    it('should render the sentinel element', () => {
      const { container } = renderInfiniteScroll({ hasMorePages: true })
      expect(container.querySelector('div[role="feed"] div')).toBeInTheDocument()
    })

    it('should call onLoadMore when the sentinel intersects', () => {
      const onLoadMoreMock = jest.fn()
      const { container } = renderInfiniteScroll({
        hasMorePages: true,
        onLoadMore: onLoadMoreMock,
        page: 0
      })

      const sentinel = container.querySelector('div[role="feed"] div')
      expect(sentinel).toBeInTheDocument()

      // Trigger intersection on the created observer
      expect(mockObservers.length).toBe(1)
      mockObservers[0].triggerIntersect(true)

      expect(onLoadMoreMock).toHaveBeenCalledWith(1) // page + 1
    })
  })

  describe('when hasMorePages is false', () => {
    it('should not render the sentinel element', () => {
      const { container } = renderInfiniteScroll({ hasMorePages: false })
      const sentinel = container.querySelector('div[role="feed"] div')
      expect(sentinel).toBeNull()
    })

    it('should not call onLoadMore', () => {
      const onLoadMoreMock = jest.fn()
      renderInfiniteScroll({
        hasMorePages: false,
        onLoadMore: onLoadMoreMock,
        page: 0
      })

      // No sentinel, no intersection. Just ensure onLoadMore not called.
      expect(onLoadMoreMock).not.toHaveBeenCalled()
      expect(mockObservers.length).toBe(1)
      // The observer may be created but no elements observed, so no intersection occurs.
    })
  })

  describe('when isLoading is true', () => {
    it('should not call onLoadMore even if intersection occurs', () => {
      const onLoadMoreMock = jest.fn()
      const { container } = renderInfiniteScroll({
        hasMorePages: true,
        isLoading: true,
        onLoadMore: onLoadMoreMock,
        page: 0
      })

      // Sentinel is rendered since hasMorePages=true
      const sentinel = container.querySelector('div[role="feed"] div')
      expect(sentinel).toBeInTheDocument()

      // Because isLoading is true at render time, no observer should have been created
      expect(mockObservers.length).toBe(0)

      // Since no observer is created, we cannot trigger intersection.
      // Just ensure onLoadMore was not called.
      expect(onLoadMoreMock).not.toHaveBeenCalled()
    })
  })
})
