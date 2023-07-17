import { RootState } from '../reducer'
import { fetchSmartWearableRequiredPermissionsRequest } from './actions'
import { INITIAL_STATE } from './reducer'
import {
  getData,
  getError,
  getLoading,
  getRequiredPermissions,
  getState,
  isFetchingRequiredPermissions
} from './selectors'
import { Asset } from './types'

let state: RootState

beforeEach(() => {
  state = {
    asset: {
      ...INITIAL_STATE,
      data: {
        anItemId: []
      },
      error: 'anError',
      loading: []
    }
  } as any
})

describe("when getting the asset's state", () => {
  it('should return the state', () => {
    expect(getState(state)).toEqual(state.asset)
  })
})

describe('when getting the data of the state', () => {
  it('should return the data', () => {
    expect(getData(state)).toEqual(state.asset.data)
  })
})

describe('when getting the error of the state', () => {
  it('should return the error message', () => {
    expect(getError(state)).toEqual(state.asset.error)
  })
})

describe('when getting the loading state of the state', () => {
  it('should return the loading state', () => {
    expect(getLoading(state)).toEqual(state.asset.loading)
  })
})

describe('when getting if the required permissions are being fetched', () => {
  let id: string

  beforeEach(() => {
    id = 'anAssetId'
    state.asset.loading = []
  })

  describe('and no assets are being fetched', () => {
    beforeEach(() => {
      state.asset.loading = []
    })

    it('should return false', () => {
      expect(isFetchingRequiredPermissions(state, id)).toBe(false)
    })
  })

  describe("and it isn't not being fetched", () => {
    beforeEach(() => {
      state.asset.loading = [
        fetchSmartWearableRequiredPermissionsRequest({
          id: 'anotherItemId'
        } as Asset)
      ]
    })

    it('should return false', () => {
      expect(isFetchingRequiredPermissions(state, id)).toBe(false)
    })
  })

  describe('and it is being fetched', () => {
    beforeEach(() => {
      state.asset.loading.push(
        fetchSmartWearableRequiredPermissionsRequest({ id } as Asset)
      )
    })

    it('should return true', () => {
      expect(isFetchingRequiredPermissions(state, id)).toBe(true)
    })
  })
})

describe('when getting the required permissions of an asset', () => {
  let id: string
  let requiredPermissions: string[]

  beforeEach(() => {
    id = 'anAssetId'
  })

  describe('and there are no required permissions related to that asset', () => {
    it('should return the them ', () => {
      expect(getRequiredPermissions(state, id)).toEqual([])
    })
  })

  describe('and there were fetched', () => {
    beforeEach(() => {
      requiredPermissions = ['aPermission']
      state.asset.data = {
        [id]: requiredPermissions
      }
    })

    it('should return the them ', () => {
      expect(getRequiredPermissions(state, id)).toEqual(state.asset.data[id])
    })
  })
})
