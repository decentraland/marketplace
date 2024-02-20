import { Context as ResponsiveContext } from 'react-responsive'
import {
  BodyShape,
  NFTCategory,
  Network,
  Rarity,
  WearableCategory
} from '@dcl/schemas'
import { fireEvent, waitFor, within } from '@testing-library/react'
import { catalogAPI } from '../../../modules/vendor/decentraland/catalog/api'
import { renderWithProviders } from '../../../utils/test'
import { getAssetUrl } from '../../../modules/asset/utils'
import { locations } from '../../../modules/routing/locations'
import { Asset, AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor'
import { SortBy } from '../../../modules/routing/types'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import { SearchBarDropdownProps } from './SearchBarDropdown.types'
import {
  LOCAL_STORAGE_RECENT_SEARCHES_KEY,
  SearchBarDropdown
} from './SearchBarDropdown'
import {
  COLLECTION_ROW_DATA_TEST_ID,
  NO_RESULTS_DATA_TEST_ID,
  RECENT_SEARCHES_DATA_TEST_ID,
  SEE_ALL_COLLECTIBLES_DATA_TEST_ID,
  SKELETONS_DATA_TEST_ID
} from './constants'

jest.mock('decentraland-dapps/dist/containers/Profile', () => {
  return {
    __esModule: true,
    default: () => <div>Profile</div>
  }
})
jest.mock('../../../modules/vendor/decentraland/catalog/api')
jest.mock('../../../modules/vendor/decentraland/builder/api')

const mockLocalStorage = () =>
  (() => {
    let store = {} as Storage

    return {
      getItem(key: string) {
        return store[key]
      },

      setItem(key: string, value: string) {
        store[key] = value
      },

      removeItem(key: string) {
        delete store[key]
      },

      clear() {
        store = {} as Storage
      }
    }
  })()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage()
})

const MOCKED_COLLECTION = {
  id: 'an id',
  name: 'Flock Fits - Fuego',
  eth_address: 'an address',
  salt: 'a salt',
  contract_address: '0x1682e68c0fc58716e24949ae72f6ca331dedf21b',
  is_published: true,
  created_at: '2022-07-04T04:24:46.000Z',
  updated_at: '2022-07-11T19:46:43.000Z',
  managers: [],
  minters: ['0x214ffc0f0103735728dc66b61a22e4f163e275ae'],
  is_approved: true,
  reviewed_at: '2022-07-11T19:46:43.000Z',
  forum_link:
    'https://forum.decentraland.org/t/collection-flock-fits-fuego-created-by-blocked-is-ready-for-review/12886',
  lock: '2022-07-04T04:24:42.510Z',
  forum_id: 51917,
  item_count: '1',
  urn:
    'urn:decentraland:matic:collections-v2:0x1682e68c0fc58716e24949ae72f6ca331dedf21b'
}

const MOCKED_CREATOR = {
  name: 'PepeFuego',
  address: '0xanAddress',
  collections: 23
}

const MOCKED_ITEM = {
  id: '0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562-0',
  beneficiary: '0x6240b908f4880da265c2e55d5ca644b50a4cb0d4',
  itemId: '0',
  name: 'Rare Pepe Shirt Male',
  thumbnail:
    'https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562:0/thumbnail',
  url: '/contracts/0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562/items/0',
  category: NFTCategory.WEARABLE,
  contractAddress: '0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562',
  rarity: Rarity.COMMON,
  available: 98,
  isOnSale: false,
  creator: '0x6240b908f4880da265c2e55d5ca644b50a4cb0d4',
  data: {
    wearable: {
      description: '',
      category: WearableCategory.BODY_SHAPE,
      bodyShapes: [BodyShape.FEMALE],
      rarity: Rarity.LEGENDARY,
      isSmart: false
    }
  },
  network: Network.MATIC,
  chainId: 137,
  price: '22000000000000000000',
  createdAt: 1660274029,
  updatedAt: 1660677796,
  reviewedAt: 1660677842,
  firstListedAt: 0,
  soldAt: 0,
  maxListingPrice: null,
  minListingPrice: null,
  listings: 0,
  owners: null,
  urn:
    'urn:decentraland:matic:collections-v2:0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562:0',
  picks: {
    count: 0
  }
}

function renderSearchDropBarDropdown(
  props: Partial<SearchBarDropdownProps> = {}
) {
  const defaultProps: SearchBarDropdownProps = {
    searchTerm: '',
    category: NFTCategory.WEARABLE,
    onSearch: jest.fn(),
    fetchedCreators: [],
    isLoadingCreators: false,
    onFetchCreators: jest.fn(),
    onClickOutside: jest.fn()
  }
  return renderWithProviders(
    <ResponsiveContext.Provider value={{ width: 900 }}>
      <SearchBarDropdown {...defaultProps} {...props} />
    </ResponsiveContext.Provider>
  )
}

describe('SearchBarDropdown', () => {
  describe('when providing a search term', () => {
    let props: Partial<SearchBarDropdownProps>
    beforeEach(() => {
      props = {
        searchTerm: 'example'
      }
    })

    describe('and its still loading', () => {
      beforeEach(() => {
        ;(catalogAPI.get as jest.Mock).mockResolvedValueOnce({
          data: []
        })
      })
      it('should render the component', () => {
        const { getByTestId } = renderSearchDropBarDropdown(props)
        expect(getByTestId('search-bar-dropdown')).toBeInTheDocument()
      })

      it('should render search tabs correctly', () => {
        const { container } = renderSearchDropBarDropdown(props)
        expect(container.querySelector('.dcl.tabs')).toBeInTheDocument()
      })

      it('renders loading skeleton while loading', () => {
        const { getAllByTestId } = renderSearchDropBarDropdown(props)
        expect(getAllByTestId(SKELETONS_DATA_TEST_ID)).toHaveLength(5)
      })
    })

    describe('and the user is searching for collectibles', () => {
      describe('and there are results', () => {
        beforeEach(() => {
          ;(catalogAPI.get as jest.Mock).mockResolvedValueOnce({
            data: [MOCKED_ITEM]
          })
        })

        it('should render the results', async () => {
          const { getByText } = renderSearchDropBarDropdown(props)
          await waitFor(() => {
            expect(getByText(MOCKED_ITEM.name)).toBeInTheDocument()
          })
        })

        it('should have the correct asset url in the result rendered', async () => {
          const { container } = renderSearchDropBarDropdown(props)
          await waitFor(async () => {
            expect(within(container).getByRole('link')).toHaveAttribute(
              'href',
              getAssetUrl(MOCKED_ITEM as Asset)
            )
          })
        })

        it('should save the result in the recent searches on the click event', async () => {
          const { container } = renderSearchDropBarDropdown(props)
          await waitFor(async () => {
            const link = within(container).getByRole('link')
            await fireEvent.click(link)
            expect(
              localStorage.getItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY)
            ).toBe(JSON.stringify([MOCKED_ITEM]))
          })
        })

        it('should render the see all button', async () => {
          const { getByTestId } = renderSearchDropBarDropdown(props)
          await waitFor(async () => {
            expect(
              getByTestId(SEE_ALL_COLLECTIBLES_DATA_TEST_ID)
            ).toBeInTheDocument()
          })
        })

        it('should call the onSearch handler when clicking the see all button', async () => {
          const onSearch = jest.fn()
          const { getByTestId } = renderSearchDropBarDropdown({
            ...props,
            onSearch
          })
          await waitFor(async () => {
            let button = getByTestId(SEE_ALL_COLLECTIBLES_DATA_TEST_ID)
            await fireEvent.click(button)
            expect(onSearch).toHaveBeenCalledWith({
              value: props.searchTerm
            })
          })
        })

        it('should call the onSearch handler when hitting enter', async () => {
          const onSearch = jest.fn()
          renderSearchDropBarDropdown({
            ...props,
            onSearch
          })
          await waitFor(async () => {
            await fireEvent.keyDown(document, { key: 'Enter' })
            expect(onSearch).toHaveBeenCalledWith({
              value: props.searchTerm
            })
          })
        })
      })

      describe('and there are no results for the search term', () => {
        beforeEach(() => {
          ;(catalogAPI.get as jest.Mock).mockResolvedValueOnce({
            data: []
          })
        })
        it('should render the no results text', async () => {
          const { getByTestId } = renderSearchDropBarDropdown(props)

          await waitFor(async () => {
            expect(getByTestId(NO_RESULTS_DATA_TEST_ID)).toBeInTheDocument()
          })
        })
      })
    })

    describe('and the user is searching for creators', () => {
      const renderAndSelectCreatorsTab = async (
        props: Partial<SearchBarDropdownProps> = {}
      ) => {
        const render = renderSearchDropBarDropdown(props)
        await waitFor(() => {
          const creatorsTab = render.getByText('Creators')
          fireEvent.click(creatorsTab)
        })
        return render
      }

      beforeEach(() => {
        localStorage.removeItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY)
      })

      describe('and there are results', () => {
        beforeEach(() => {
          ;(catalogAPI.get as jest.Mock).mockResolvedValue({
            data: []
          })
          props = {
            ...props,
            fetchedCreators: [MOCKED_CREATOR]
          }
        })

        it('should render the results', async () => {
          const render = await renderAndSelectCreatorsTab(props)

          await waitFor(() => {
            expect(render.getByText(MOCKED_CREATOR.name)).toBeInTheDocument()
          })
        })

        it('should have the correct asset url in the result rendered', async () => {
          const onSearch = jest.fn()
          const { container } = await renderAndSelectCreatorsTab({
            ...props,
            onSearch
          })
          await waitFor(async () => {
            expect(within(container).getByRole('link')).toHaveAttribute(
              'href',
              locations.account(MOCKED_CREATOR.address, {
                assetType: AssetType.ITEM,
                section: Section.WEARABLES,
                vendor: VendorName.DECENTRALAND,
                page: 1,
                sortBy: SortBy.NEWEST
              })
            )
          })
        })

        it('should save the result in the recent searches on the click event', async () => {
          const onSearch = jest.fn()
          const { container } = await renderAndSelectCreatorsTab({
            ...props,
            onSearch
          })
          await waitFor(async () => {
            const link = within(container).getByRole('link')
            await fireEvent.click(link)
            expect(
              localStorage.getItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY)
            ).toBe(JSON.stringify([MOCKED_CREATOR]))
          })
        })

        it('should not render the see all button', async () => {
          const { queryByTestId } = await renderAndSelectCreatorsTab(props)
          await waitFor(async () => {
            expect(
              queryByTestId(SEE_ALL_COLLECTIBLES_DATA_TEST_ID)
            ).not.toBeInTheDocument()
          })
        })
      })

      describe('and there are no results for the search term', () => {
        beforeEach(() => {
          ;(catalogAPI.get as jest.Mock).mockResolvedValueOnce({
            data: []
          })
        })
        it('should render the no results text', async () => {
          const { getByTestId } = renderSearchDropBarDropdown(props)

          await waitFor(async () => {
            expect(getByTestId(NO_RESULTS_DATA_TEST_ID)).toBeInTheDocument()
          })
        })
      })
    })

    describe('and the user is searching for collections', () => {
      const renderAndSelectCollectionsTab = async (
        props: Partial<SearchBarDropdownProps> = {}
      ) => {
        const render = renderSearchDropBarDropdown(props)
        await waitFor(() => {
          const creatorsTab = render.getByText('Collections')
          fireEvent.click(creatorsTab)
        })
        return render
      }

      beforeEach(() => {
        localStorage.removeItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY)
      })

      describe('and there are results', () => {
        beforeEach(() => {
          ;(builderAPI.fetchPublishedCollectionsBySearchTerm as jest.Mock).mockResolvedValue(
            [MOCKED_COLLECTION]
          )
          ;(catalogAPI.get as jest.Mock).mockResolvedValue({
            data: []
          })
        })

        it('should render the results', async () => {
          const render = await renderAndSelectCollectionsTab(props)

          await waitFor(() => {
            expect(render.getByText(MOCKED_COLLECTION.name)).toBeInTheDocument()
          })
        })

        it('should call the onSearch on the result click', async () => {
          const onSearch = jest.fn()
          const { container } = await renderAndSelectCollectionsTab({
            ...props,
            onSearch
          })
          await waitFor(async () => {
            const collectionRow = within(container).getByTestId(
              `${COLLECTION_ROW_DATA_TEST_ID}-${MOCKED_COLLECTION.name}`
            )
            await fireEvent.click(collectionRow)
            expect(onSearch).toHaveBeenCalledWith({
              contractAddresses: [MOCKED_COLLECTION.contract_address]
            })
          })
        })

        describe('when clicking the component', () => {
          it('should save the result in the recent searches on the click event', async () => {
            const onSearch = jest.fn()
            const { container } = await renderAndSelectCollectionsTab({
              ...props,
              onSearch
            })
            await waitFor(async () => {
              const collectionRow = within(container).getByTestId(
                `${COLLECTION_ROW_DATA_TEST_ID}-${MOCKED_COLLECTION.name}`
              )
              await fireEvent.click(collectionRow)
              expect(
                localStorage.getItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY)
              ).toBe(JSON.stringify([MOCKED_COLLECTION]))
            })
          })
        })

        it('should not render the see all button', async () => {
          const { queryByTestId } = await renderAndSelectCollectionsTab(props)
          await waitFor(async () => {
            expect(
              queryByTestId(SEE_ALL_COLLECTIBLES_DATA_TEST_ID)
            ).not.toBeInTheDocument()
          })
        })

        it('should call the onSearch handler when hitting enter', async () => {
          const onSearch = jest.fn()
          await renderAndSelectCollectionsTab({
            ...props,
            onSearch
          })
          await waitFor(async () => {
            await fireEvent.keyDown(document, { key: 'Enter' })
            expect(onSearch).toHaveBeenCalledWith({
              contractAddresses: [MOCKED_COLLECTION.contract_address],
              value: ''
            })
          })
        })
      })

      describe('and there are no results for the search term', () => {
        beforeEach(() => {
          ;(catalogAPI.get as jest.Mock).mockResolvedValueOnce({
            data: []
          })
        })
        it('should render the no results text', async () => {
          const { getByTestId } = renderSearchDropBarDropdown(props)

          await waitFor(async () => {
            expect(getByTestId(NO_RESULTS_DATA_TEST_ID)).toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('when not providing a search term', () => {
    let props: Partial<SearchBarDropdownProps>
    beforeEach(() => {
      props = {
        searchTerm: ''
      }
    })

    describe('when there are recent searches', () => {
      let itemName: string
      beforeEach(() => {
        itemName = 'Rare Pepe Shirt Male'
        localStorage.setItem(
          LOCAL_STORAGE_RECENT_SEARCHES_KEY,
          `[{"id":"0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562-0","beneficiary":"0x6240b908f4880da265c2e55d5ca644b50a4cb0d4","itemId":"0","name":"${itemName}","thumbnail":"https://peer.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562:0/thumbnail","url":"/contracts/0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562/items/0","category":"wearable","contractAddress":"0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562","rarity":"legendary","available":98,"isOnSale":false,"creator":"0x6240b908f4880da265c2e55d5ca644b50a4cb0d4","data":{"wearable":{"description":"","category":"upper_body","bodyShapes":["BaseMale"],"rarity":"legendary","isSmart":false}},"network":"MATIC","chainId":137,"price":"22000000000000000000","createdAt":1660274029,"updatedAt":1660677796,"reviewedAt":1660677842,"firstListedAt":0,"soldAt":0,"minPrice":null,"maxListingPrice":null,"minListingPrice":null,"listings":0,"owners":null,"urn":"urn:decentraland:matic:collections-v2:0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562:0","picks":{"itemId":"0xffce00acc0d17eb01c3d2f9c3fcb3ab26519c562-0","count":0}}]`
        )
      })
      it('renders recent content when searchTerm is empty', () => {
        const { getByTestId, getByText } = renderSearchDropBarDropdown(props)
        expect(getByTestId(RECENT_SEARCHES_DATA_TEST_ID)).toBeInTheDocument()
        expect(getByText(itemName)).toBeInTheDocument()
      })
    })

    describe('when there are no recent searches', () => {
      beforeEach(() => {
        localStorage.removeItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY)
      })
      it('should not render the component', () => {
        const { queryByTestId } = renderSearchDropBarDropdown(props)
        expect(queryByTestId('search-bar-dropdown')).not.toBeInTheDocument()
      })
    })
  })
})
