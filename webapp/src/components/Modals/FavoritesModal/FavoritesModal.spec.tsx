import { waitForElementToBeRemoved } from '@testing-library/react'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { FavoritesAPI } from '../../../modules/vendor/decentraland/favorites'
import { renderWithProviders } from '../../../utils/test'
import FavoritesModal from './FavoritesModal'
import { Props } from './FavoritesModal.types'

// Fixing warning: `NaN` is an invalid value for the `height` css style property.
jest.mock('react-virtualized-auto-sizer', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: any }) => {
      return children({ width: 100, height: 100 })
    }
  }
})
jest.mock('../../../modules/vendor/decentraland/favorites')

const itemId = 'anItemId'
const identity = {} as AuthIdentity

function renderFavoritesModal(props: Partial<Props> = {}) {
  return renderWithProviders(<FavoritesModal name={'A name'} metadata={{ itemId }} identity={identity} onClose={jest.fn()} {...props} />, {
    preloadedState: {
      modal: {}
    }
  })
}

describe('when loading the component', () => {
  let apiResponse: {
    addresses: string[]
    total: number
  }
  let apiFetchPromiseResolve: (value: { addresses: string[]; total: number }) => void
  let apiFetchPromiseReject: (error: Error) => void

  beforeEach(() => {
    const apiFetchPromise: Promise<{
      addresses: string[]
      total: number
    }> = new Promise((resolve: any, reject: any) => {
      apiFetchPromiseResolve = resolve
      apiFetchPromiseReject = reject
    })

    jest.spyOn(FavoritesAPI.prototype, 'getWhoFavoritedAnItem').mockReturnValue(apiFetchPromise)
  })

  describe('and there are favorites for the item id', () => {
    beforeEach(() => {
      apiResponse = { addresses: ['0x0', '0x1'], total: 0 }
    })

    it('should fetch the first batch of favorites showing the loader in the process and not show the empty component', async () => {
      const { getByTestId, queryByText } = renderFavoritesModal()

      expect(FavoritesAPI.prototype.getWhoFavoritedAnItem).toHaveBeenCalledWith(itemId, 100, 0)
      apiFetchPromiseResolve(apiResponse)

      await waitForElementToBeRemoved(() => getByTestId('favorites-modal-loader'))
      expect(queryByText('Users have not saved this item')).not.toBeInTheDocument()
    })
  })

  describe('and the are no favorites for the item id', () => {
    beforeEach(() => {
      apiResponse = { addresses: [], total: 0 }
    })

    it('should fetch the first batch of favorites showing the loader in the process and then show the empty component', async () => {
      const { getByTestId, getByText } = renderFavoritesModal()
      expect(FavoritesAPI.prototype.getWhoFavoritedAnItem).toHaveBeenCalledWith(itemId, 100, 0)
      apiFetchPromiseResolve(apiResponse)
      await waitForElementToBeRemoved(() => getByTestId('favorites-modal-loader'))
      expect(getByText('Users have not saved this item')).toBeInTheDocument()
    })
  })

  describe('and the fetching of favorites fails', () => {
    it('should remove the loader and show an error message', async () => {
      const { getByTestId, getByText } = renderFavoritesModal()
      apiFetchPromiseReject(new Error('An error'))
      await waitForElementToBeRemoved(() => getByTestId('favorites-modal-loader'))
      expect(getByText('An error')).toBeInTheDocument()
    })
  })
})
