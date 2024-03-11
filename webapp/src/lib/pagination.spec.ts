import { renderHook, act } from '@testing-library/react-hooks'
import { useHistory, useLocation } from 'react-router-dom'
import { PAGE_SIZE } from '../modules/vendor/api'
import { UsePaginationResult, usePagination } from './pagination'

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
  useLocation: jest.fn()
}))

let historyPushMock: jest.Mock
let useLocationMock: { search: string; pathname: string }

beforeEach(() => {
  historyPushMock = jest.fn()
  useLocationMock = {
    search: '',
    pathname: '/v1/lists'
  }
  ;(useHistory as jest.Mock).mockReturnValue({ push: historyPushMock })
  ;(useLocation as jest.Mock).mockReturnValue(useLocationMock)
})

describe('when getting the pagination hook', () => {
  let renderedHook: ReturnType<typeof renderHook>
  let currentResult: UsePaginationResult<string, string>

  describe('and the page size hook prop is not set', () => {
    describe('and there\'s no "first" parameter', () => {
      beforeEach(() => {
        renderedHook = renderHook(() => usePagination())
        currentResult = renderedHook.result.current as UsePaginationResult<string, string>
      })

      it('should return the default page size in the "first" property', () => {
        expect(currentResult.first).toEqual(PAGE_SIZE)
      })
    })

    describe('and there\'s a "first" parameter', () => {
      beforeEach(() => {
        useLocationMock.search = 'first=10'
        renderedHook = renderHook(() => usePagination())
        currentResult = renderedHook.result.current as UsePaginationResult<string, string>
      })

      it('should return the value of the "first" parameter in the "first" property', () => {
        expect(currentResult.first).toEqual(10)
      })
    })
  })

  describe('and the page size is set', () => {
    let pageSize: number
    beforeEach(() => {
      pageSize = 10
    })

    describe('and there\'s no "first" parameter', () => {
      beforeEach(() => {
        renderedHook = renderHook(() => usePagination({ pageSize }))
        currentResult = renderedHook.result.current as UsePaginationResult<string, string>
      })

      it('should return the page size as the "first" property', () => {
        expect(currentResult.first).toEqual(pageSize)
      })
    })

    describe('and there\'s a "first" parameter', () => {
      beforeEach(() => {
        useLocationMock.search = 'first=10'
        renderedHook = renderHook(() => usePagination())
        currentResult = renderedHook.result.current as UsePaginationResult<string, string>
      })

      it('should return the value of the "first" parameter in the "first" property', () => {
        expect(currentResult.first).toEqual(10)
      })
    })
  })

  describe('and there are no filters', () => {
    beforeEach(() => {
      useLocationMock.search = 'page=1&first=10&offset=0&sortBy=createdAt'
    })

    it('should return an empty object for the filters', () => {
      expect(currentResult.filters).toEqual({})
    })
  })

  describe('and there are some filters', () => {
    beforeEach(() => {
      useLocationMock.search = 'page=1&first=10&offset=0&sortBy=createdAt&filter1=value1&filter2=value2'
      renderedHook = renderHook(() => usePagination())
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
    })

    it('should return the filters', () => {
      expect(currentResult.filters).toEqual({
        filter1: 'value1',
        filter2: 'value2'
      })
    })
  })

  describe('and the sorting parameter is set', () => {
    beforeEach(() => {
      useLocationMock.search = 'sortBy=createdAt'
      renderedHook = renderHook(() => usePagination())
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
    })

    it('should return sortBy with the value of the parameter', () => {
      expect(currentResult.sortBy).toEqual('createdAt')
    })
  })

  describe('and the sorting parameter is not set', () => {
    beforeEach(() => {
      useLocationMock.search = ''
      renderedHook = renderHook(() => usePagination())
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
    })

    it('should return sortBy as undefined', () => {
      expect(currentResult.sortBy).toBeUndefined()
    })
  })

  describe('and using the goToNextPage function', () => {
    beforeEach(() => {
      useLocationMock.search = 'filter=value&sortBy=createdAt'
      renderedHook = renderHook(() => usePagination())
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
      act(() => {
        currentResult.goToNextPage()
      })
    })

    it('should push the next page into the history with the current parameters', () => {
      expect(historyPushMock).toHaveBeenCalledWith('/v1/lists?filter=value&sortBy=createdAt&page=2')
    })
  })

  describe('and using the goToPage function', () => {
    beforeEach(() => {
      useLocationMock.search = 'filter=value&sortBy=createdAt'
      renderedHook = renderHook(() => usePagination())
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
      act(() => {
        currentResult.goToPage(4)
      })
    })

    it('should push the desired page into the history with the current parameters', () => {
      expect(historyPushMock).toHaveBeenCalledWith('/v1/lists?filter=value&sortBy=createdAt&page=4')
    })
  })

  describe('and using the changeSorting function', () => {
    beforeEach(() => {
      useLocationMock.search = 'filter=value&sortBy=createdAt'
      renderedHook = renderHook(() => usePagination())
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
      act(() => {
        currentResult.changeSorting('someSortProperty')
      })
    })

    it('should push the first page into the history with the changed sorting parameter and the current filters', () => {
      expect(historyPushMock).toHaveBeenCalledWith('/v1/lists?filter=value&sortBy=someSortProperty&page=1')
    })
  })

  describe('and using the changeFilter function', () => {
    beforeEach(() => {
      useLocationMock.search = 'filter=value&anotherFilter=someValue&sortBy=createdAt'
      renderedHook = renderHook(() => usePagination())
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
    })

    describe('and the flag to remove all the old filters is set', () => {
      beforeEach(() => {
        act(() => {
          currentResult.changeFilter('filter', 'newValue', {
            clearOldFilters: true
          })
        })
      })

      it('should push the first page into the history only with the new filter and the current sorting', () => {
        expect(historyPushMock).toHaveBeenCalledWith('/v1/lists?page=1&sortBy=createdAt&filter=newValue')
      })
    })

    describe('and the flag to remove all the old filters is not set', () => {
      beforeEach(() => {
        act(() => {
          currentResult.changeFilter('filter', 'newValue', {
            clearOldFilters: false
          })
        })
      })

      it('should push the first page into the history with the changed filter and the current sorting', () => {
        expect(historyPushMock).toHaveBeenCalledWith('/v1/lists?filter=newValue&anotherFilter=someValue&sortBy=createdAt&page=1')
      })
    })
  })

  describe('and the count option is set', () => {
    beforeEach(() => {
      useLocationMock.search = 'page=1'
      renderedHook = renderHook(() => usePagination({ pageSize: 50, count: 101 }))
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
    })

    it('should compute the number of pages', () => {
      expect(currentResult.pages).toEqual(3)
    })
  })

  describe("and there's no more pages left", () => {
    beforeEach(() => {
      useLocationMock.search = 'page=3'
      renderedHook = renderHook(() => usePagination({ pageSize: 50, count: 101 }))
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
    })

    it('should return hasMorePages as false', () => {
      expect(currentResult.hasMorePages).toBe(false)
    })
  })

  describe('and there are more pages left', () => {
    beforeEach(() => {
      useLocationMock.search = 'page=1'
      renderedHook = renderHook(() => usePagination({ pageSize: 50, count: 101 }))
      currentResult = renderedHook.result.current as UsePaginationResult<string, string>
    })

    it('should return hasMorePages as true', () => {
      expect(currentResult.hasMorePages).toBe(true)
    })
  })
})
