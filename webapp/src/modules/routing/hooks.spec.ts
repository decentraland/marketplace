import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { renderHook } from '@testing-library/react'
import { View } from '../ui/types'
import {
  getNFTAddressAndTokenIdFromCurrentUrlPath,
  getListIdFromCurrentUrlPath,
  getUserAddressFromUrlPath,
  useGetNFTAddressAndTokenIdFromCurrentUrl,
  useGetItemAddressAndTokenIdFromCurrentUrl,
  useGetCollectionAddressFromCurrentUrl,
  useGetUserAddressFromCurrentUrl,
  useGetBrowseOptions,
  useGetSortByOptionsFromCurrentUrl,
  useGetPageName,
  useGetIsMapFromSearchParameters,
  useGetIsBuyWithCardPageFromCurrentUrl,
  useGetPaginationParamsFromCurrentUrl
} from './hooks'
import { PageName } from './types'

// Mock all the problematic dependencies
jest.mock('../ui/browse/selectors', () => ({
  getView: jest.fn()
}))

// Mock react-redux and react-router-dom
jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<typeof import('react-router-dom')>('react-router-dom'),
  useLocation: jest.fn()
}))

const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>
const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>

// Import the functions after mocking

describe('when getting NFT address and token ID from current URL path', () => {
  let currentPathname: string

  describe('and URL contains valid NFT contract and token parameters', () => {
    beforeEach(() => {
      currentPathname = '/contracts/0x123abc/tokens/456'
    })

    it('should return contract address and token ID', () => {
      const result = getNFTAddressAndTokenIdFromCurrentUrlPath(currentPathname)
      expect(result).toEqual({
        contractAddress: '0x123abc',
        tokenId: '456'
      })
    })
  })

  describe('and URL does not match NFT pattern', () => {
    beforeEach(() => {
      currentPathname = '/other-page'
    })

    it('should return null values', () => {
      const result = getNFTAddressAndTokenIdFromCurrentUrlPath(currentPathname)
      expect(result).toEqual({
        contractAddress: null,
        tokenId: null
      })
    })
  })
})

describe('when using hook to get NFT address and token ID from current URL', () => {
  let pathname: string

  describe('and current location has NFT URL pattern', () => {
    beforeEach(() => {
      pathname = '/contracts/0x456def/tokens/789'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return contract address and token ID', () => {
      const { result } = renderHook(() => useGetNFTAddressAndTokenIdFromCurrentUrl())
      expect(result.current).toEqual({
        contractAddress: '0x456def',
        tokenId: '789'
      })
    })
  })

  describe('and current location does not have NFT URL pattern', () => {
    beforeEach(() => {
      pathname = '/browse'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return null values', () => {
      const { result } = renderHook(() => useGetNFTAddressAndTokenIdFromCurrentUrl())
      expect(result.current).toEqual({
        contractAddress: null,
        tokenId: null
      })
    })
  })
})

describe('when using hook to get item address and token ID from current URL', () => {
  let pathname: string

  describe('and current location has item URL pattern', () => {
    beforeEach(() => {
      pathname = '/contracts/0x789ghi/items/123'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return contract address and token ID', () => {
      const { result } = renderHook(() => useGetItemAddressAndTokenIdFromCurrentUrl())
      expect(result.current).toEqual({
        contractAddress: '0x789ghi',
        tokenId: '123'
      })
    })
  })

  describe('and current location does not have item URL pattern', () => {
    beforeEach(() => {
      pathname = '/browse'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return null values', () => {
      const { result } = renderHook(() => useGetItemAddressAndTokenIdFromCurrentUrl())
      expect(result.current).toEqual({
        contractAddress: null,
        tokenId: null
      })
    })
  })
})

describe('when getting list ID from current URL path', () => {
  let currentPathname: string

  describe('and URL contains valid list ID parameter', () => {
    beforeEach(() => {
      currentPathname = '/lists/my-favorites'
    })

    it('should return list ID', () => {
      const result = getListIdFromCurrentUrlPath(currentPathname)
      expect(result).toBe('my-favorites')
    })
  })

  describe('and URL does not match list pattern', () => {
    beforeEach(() => {
      currentPathname = '/browse'
    })

    it('should return null', () => {
      const result = getListIdFromCurrentUrlPath(currentPathname)
      expect(result).toBe(null)
    })
  })
})

describe('when using hook to get collection address from current URL', () => {
  let pathname: string

  describe('and current location has collection URL pattern', () => {
    beforeEach(() => {
      pathname = '/collections/0xabc123'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return collection contract address', () => {
      const { result } = renderHook(() => useGetCollectionAddressFromCurrentUrl())
      expect(result.current).toBe('0xabc123')
    })
  })

  describe('and current location does not have collection URL pattern', () => {
    beforeEach(() => {
      pathname = '/browse'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return null', () => {
      const { result } = renderHook(() => useGetCollectionAddressFromCurrentUrl())
      expect(result.current).toBe(null)
    })
  })
})

describe('when getting user address from URL path', () => {
  let currentPathname: string

  describe('and URL contains valid user address parameter', () => {
    beforeEach(() => {
      currentPathname = '/accounts/0xuser123'
    })

    it('should return user address', () => {
      const result = getUserAddressFromUrlPath(currentPathname)
      expect(result).toBe('0xuser123')
    })
  })

  describe('and URL does not match account pattern', () => {
    beforeEach(() => {
      currentPathname = '/browse'
    })

    it('should return null', () => {
      const result = getUserAddressFromUrlPath(currentPathname)
      expect(result).toBe(null)
    })
  })
})

describe('when using hook to get user address from current URL', () => {
  let pathname: string

  describe('and current location has account URL pattern', () => {
    beforeEach(() => {
      pathname = '/accounts/0xuser456'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return user address', () => {
      const { result } = renderHook(() => useGetUserAddressFromCurrentUrl())
      expect(result.current).toBe('0xuser456')
    })
  })

  describe('and current location does not have account URL pattern', () => {
    beforeEach(() => {
      pathname = '/browse'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return null', () => {
      const { result } = renderHook(() => useGetUserAddressFromCurrentUrl())
      expect(result.current).toBe(null)
    })
  })
})

describe('when using hook to get browse options', () => {
  let search: string
  let pathname: string
  let view: View

  describe('and location has search parameters and view', () => {
    beforeEach(() => {
      search = '?vendor=decentraland&section=wearables&page=1'
      pathname = '/browse'
      view = View.MARKET
      mockUseLocation.mockReturnValue({
        pathname,
        search,
        hash: '',
        state: null,
        key: 'test'
      })
      mockUseSelector.mockReturnValue(view)
    })

    it('should return browse options with current parameters', () => {
      const { result } = renderHook(() => useGetBrowseOptions())
      expect(result.current).toMatchObject({
        vendor: 'decentraland',
        section: 'wearables',
        page: 1,
        view: View.MARKET
      })
    })
  })
})

describe('when using hook to get sort by options from current URL', () => {
  let search: string
  let pathname: string
  let view: View

  describe('and location has sort-related parameters', () => {
    beforeEach(() => {
      search = '?onlyOnSale=true'
      pathname = '/browse'
      view = View.MARKET
      mockUseLocation.mockReturnValue({
        pathname,
        search,
        hash: '',
        state: null,
        key: 'test'
      })
      mockUseSelector.mockReturnValue(view)
    })

    it('should return sort by options based on current parameters', () => {
      const { result } = renderHook(() => useGetSortByOptionsFromCurrentUrl())
      expect(Array.isArray(result.current)).toBe(true)
      expect(result.current.length).toBeGreaterThan(0)
    })
  })
})

describe('when using hook to get page name', () => {
  let pathname: string

  describe('and pathname is root', () => {
    beforeEach(() => {
      pathname = '/'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return HOME page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.HOME)
    })
  })

  describe('and pathname is buy NFT status', () => {
    beforeEach(() => {
      pathname = '/contracts/0x123/tokens/456/buy/status'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return BUY_NFT_STATUS page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.BUY_NFT_STATUS)
    })
  })

  describe('and pathname is buy item status', () => {
    beforeEach(() => {
      pathname = '/contracts/0x123/items/456/buy/status'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return BUY_ITEM_STATUS page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.BUY_ITEM_STATUS)
    })
  })

  describe('and pathname is cancel NFT sale', () => {
    beforeEach(() => {
      pathname = '/contracts/0x123/tokens/456/cancel'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return CANCEL_NFT_SALE page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.CANCEL_NFT_SALE)
    })
  })

  describe('and pathname is transfer NFT', () => {
    beforeEach(() => {
      pathname = '/contracts/0x123/tokens/456/transfer'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return TRANSFER_NFT page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.TRANSFER_NFT)
    })
  })

  describe('and pathname is bid NFT', () => {
    beforeEach(() => {
      pathname = '/contracts/0x123/tokens/456/bid'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return BID_NFT page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.BID_NFT)
    })
  })

  describe('and pathname is sign in', () => {
    beforeEach(() => {
      pathname = '/sign-in'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return SIGN_IN page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.SIGN_IN)
    })
  })

  describe('and pathname is settings', () => {
    beforeEach(() => {
      pathname = '/settings'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return SETTINGS page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.SETTINGS)
    })
  })

  describe('and pathname is lands', () => {
    beforeEach(() => {
      pathname = '/lands'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return LANDS page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.LANDS)
    })
  })

  describe('and pathname is names', () => {
    beforeEach(() => {
      pathname = '/names/browse'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return NAMES page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.NAMES)
    })
  })

  describe('and pathname is collection', () => {
    beforeEach(() => {
      pathname = '/collections/0x123'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return COLLECTION page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.COLLECTION)
    })
  })

  describe('and pathname is browse', () => {
    beforeEach(() => {
      pathname = '/browse'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return BROWSE page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.BROWSE)
    })
  })

  describe('and pathname is campaign', () => {
    beforeEach(() => {
      pathname = '/campaign'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return CAMPAIGN page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.CAMPAIGN)
    })
  })

  describe('and pathname is current account', () => {
    beforeEach(() => {
      pathname = '/account'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return ACCOUNT page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.ACCOUNT)
    })
  })

  describe('and pathname is list with a list name', () => {
    beforeEach(() => {
      pathname = '/lists/favorites'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return LIST page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.LIST)
    })
  })

  describe('and pathname is lists', () => {
    beforeEach(() => {
      pathname = '/lists'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return LISTS page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.LISTS)
    })
  })

  describe('and pathname is accounts', () => {
    beforeEach(() => {
      pathname = '/accounts/0x123'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return ACCOUNTS page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.ACCOUNTS)
    })
  })

  describe('and pathname is NFT detail', () => {
    beforeEach(() => {
      pathname = '/contracts/0x123/tokens/456'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return NFT_DETAIL page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.NFT_DETAIL)
    })
  })

  describe('and pathname is item detail', () => {
    beforeEach(() => {
      pathname = '/contracts/0x123/items/456'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return ITEM_DETAIL page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.ITEM_DETAIL)
    })
  })

  describe('and pathname is parcel detail', () => {
    beforeEach(() => {
      pathname = '/parcels/10/20/detail'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return PARCEL_DETAIL page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.PARCEL_DETAIL)
    })
  })

  describe('and pathname is estate detail', () => {
    beforeEach(() => {
      pathname = '/estates/123/detail'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return ESTATE_DETAIL page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.ESTATE_DETAIL)
    })
  })

  describe('and pathname is activity', () => {
    beforeEach(() => {
      pathname = '/activity'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return ACTIVITY page name', () => {
      const { result } = renderHook(() => useGetPageName())
      expect(result.current).toBe(PageName.ACTIVITY)
    })
  })

  describe('and pathname is unknown', () => {
    beforeEach(() => {
      pathname = '/unknown-page'
      mockUseLocation.mockReturnValue({
        pathname,
        search: '',
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should throw "Unknown page" error', () => {
      expect(() => {
        renderHook(() => useGetPageName())
      }).toThrow('Unknown page')
    })
  })
})

describe('when using hook to get isMap from search parameters', () => {
  let search: string

  describe('and search contains isMap parameter as true', () => {
    beforeEach(() => {
      search = '?isMap=true'
      mockUseLocation.mockReturnValue({
        pathname: '/lands',
        search,
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return true', () => {
      const { result } = renderHook(() => useGetIsMapFromSearchParameters())
      expect(result.current).toBe(true)
    })
  })

  describe('and search contains isMap parameter as false', () => {
    beforeEach(() => {
      search = '?isMap=false'
      mockUseLocation.mockReturnValue({
        pathname: '/lands',
        search,
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return false', () => {
      const { result } = renderHook(() => useGetIsMapFromSearchParameters())
      expect(result.current).toBe(false)
    })
  })

  describe('and search does not contain isMap parameter', () => {
    beforeEach(() => {
      search = ''
      mockUseLocation.mockReturnValue({
        pathname: '/lands',
        search,
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return undefined', () => {
      const { result } = renderHook(() => useGetIsMapFromSearchParameters())
      expect(result.current).toBe(undefined)
    })
  })
})

describe('when using hook to get buy with card page from current URL', () => {
  let search: string

  describe('and search contains withCard parameter as true', () => {
    beforeEach(() => {
      search = '?withCard=true'
      mockUseLocation.mockReturnValue({
        pathname: '/contracts/0x123/tokens/456/buy',
        search,
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return true', () => {
      const { result } = renderHook(() => useGetIsBuyWithCardPageFromCurrentUrl())
      expect(result.current).toBe(true)
    })
  })

  describe('and search contains withCard parameter as false', () => {
    beforeEach(() => {
      search = '?withCard=false'
      mockUseLocation.mockReturnValue({
        pathname: '/contracts/0x123/tokens/456/buy',
        search,
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return false', () => {
      const { result } = renderHook(() => useGetIsBuyWithCardPageFromCurrentUrl())
      expect(result.current).toBe(false)
    })
  })

  describe('and search does not contain withCard parameter', () => {
    beforeEach(() => {
      search = ''
      mockUseLocation.mockReturnValue({
        pathname: '/contracts/0x123/tokens/456/buy',
        search,
        hash: '',
        state: null,
        key: 'test'
      })
    })

    it('should return false', () => {
      const { result } = renderHook(() => useGetIsBuyWithCardPageFromCurrentUrl())
      expect(result.current).toBe(false)
    })
  })
})

describe('when using hook to get pagination params from current URL', () => {
  let search: string
  let pathname: string
  let view: View

  describe('and location has pagination parameters', () => {
    beforeEach(() => {
      search = '?page=3&sortBy=cheapest&search=dragon'
      pathname = '/browse'
      view = View.MARKET
      mockUseLocation.mockReturnValue({
        pathname,
        search,
        hash: '',
        state: null,
        key: 'test'
      })
      mockUseSelector.mockReturnValue(view)
    })

    it('should return pagination parameters', () => {
      const { result } = renderHook(() => useGetPaginationParamsFromCurrentUrl())
      expect(result.current).toEqual({
        page: 3,
        sortBy: 'cheapest',
        search: 'dragon'
      })
    })
  })
})
