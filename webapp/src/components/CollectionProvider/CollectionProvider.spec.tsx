import { render } from '@testing-library/react'
import { Collection } from '@dcl/schemas'
import CollectionProvider from './CollectionProvider'
import { Props } from './CollectionProvider.types'

const aContractAddress = '0x0000000000000000000000000000000000000001'

function renderCollectionProvider(props: Partial<Props> = {}) {
  const allProps: Props = {
    contractAddress: aContractAddress,
    isLoadingCollection: false,
    isLoadingCollectionItems: false,
    onFetchCollection: jest.fn(),
    onFetchCollectionItems: jest.fn(),
    error: null,
    children: () => null,
    ...props
  }
  const element = <CollectionProvider {...allProps} />
  const view = render(element)
  return { ...view, allProps }
}

describe('when rendering the CollectionProvider', () => {
  let onFetchCollection: jest.Mock
  let onFetchCollectionItems: jest.Mock

  beforeEach(() => {
    onFetchCollection = jest.fn()
    onFetchCollectionItems = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('and the collection has not been loaded yet', () => {
    it('should request the collection', () => {
      renderCollectionProvider({ collection: undefined, onFetchCollection })

      expect(onFetchCollection).toHaveBeenCalledTimes(1)
    })
  })

  describe('and withItems is set and the collection has fewer items than its size', () => {
    let collection: Collection

    beforeEach(() => {
      collection = { contractAddress: aContractAddress, size: 4 } as Collection
    })

    it('should request the collection items at most twice across re-renders, so it does not loop', () => {
      const { rerender } = renderCollectionProvider({ collection, withItems: true, items: [], onFetchCollectionItems })

      // The items array reference changes on every render in the app (it defaults to a fresh []),
      // which re-runs the effect. Simulate that to ensure the request is bounded and never loops.
      for (let i = 0; i < 5; i++) {
        rerender(
          <CollectionProvider
            contractAddress={aContractAddress}
            collection={collection}
            withItems
            items={[]}
            isLoadingCollection={false}
            isLoadingCollectionItems={false}
            onFetchCollection={jest.fn()}
            onFetchCollectionItems={onFetchCollectionItems}
            error={null}
          >
            {() => null}
          </CollectionProvider>
        )
      }

      expect(onFetchCollectionItems).toHaveBeenCalledTimes(2)
    })
  })

  describe('and withItems is set and the collection items already match its size', () => {
    let collection: Collection

    beforeEach(() => {
      collection = { contractAddress: aContractAddress, size: 1 } as Collection
    })

    it('should not request the collection items', () => {
      renderCollectionProvider({
        collection,
        withItems: true,
        items: [{ id: 'item-1' }] as Props['items'],
        onFetchCollectionItems
      })

      expect(onFetchCollectionItems).not.toHaveBeenCalled()
    })
  })
})
