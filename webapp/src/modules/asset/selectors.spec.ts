import { RootState } from '../reducer'
import { fetchSmartWearableRequiredPermissionsRequest, fetchSmartWearableVideoHashRequest } from './actions'
import { INITIAL_STATE } from './reducer'
import {
  getAssetData,
  getData,
  getError,
  getLoading,
  getRequiredPermissions,
  getState,
  getVideoHash,
  isFetchingRequiredPermissions,
  isFetchingVideoHash
} from './selectors'
import { Asset } from './types'

let state: RootState

beforeEach(() => {
  state = {
    asset: {
      ...INITIAL_STATE,
      data: {
        anItemId: {}
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

describe('when getting the asset data of the state', () => {
  let id: string

  describe('and the asset is not set', () => {
    beforeEach(() => {
      id = 'anotherItemId'
    })

    it('should return an empty object', () => {
      expect(getAssetData(state, id)).toEqual({})
    })
  })

  describe('and the asset is already set', () => {
    beforeEach(() => {
      id = 'anItemId'
      state.asset.data = {
        [id]: { requiredPermissions: [], videoHash: 'aVideoHash' }
      }
    })

    it('should return the asset data', () => {
      expect(getAssetData(state, id)).toEqual(state.asset.data[id])
    })
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

  describe('and no required permissions are being fetched', () => {
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
      state.asset.loading.push(fetchSmartWearableRequiredPermissionsRequest({ id } as Asset))
    })

    it('should return true', () => {
      expect(isFetchingRequiredPermissions(state, id)).toBe(true)
    })
  })
})

describe('when getting if the video hash is being fetched', () => {
  let id: string

  beforeEach(() => {
    id = 'anAssetId'
    state.asset.loading = []
  })

  describe('and no video hash is being fetched', () => {
    beforeEach(() => {
      state.asset.loading = []
    })

    it('should return false', () => {
      expect(isFetchingVideoHash(state, id)).toBe(false)
    })
  })

  describe("and it isn't not being fetched", () => {
    beforeEach(() => {
      state.asset.loading = [
        fetchSmartWearableVideoHashRequest({
          id: 'anotherItemId'
        } as Asset)
      ]
    })

    it('should return false', () => {
      expect(isFetchingVideoHash(state, id)).toBe(false)
    })
  })

  describe('and it is being fetched', () => {
    beforeEach(() => {
      state.asset.loading.push(fetchSmartWearableVideoHashRequest({ id } as Asset))
    })

    it('should return true', () => {
      expect(isFetchingVideoHash(state, id)).toBe(true)
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
        [id]: { requiredPermissions }
      }
    })

    it('should return the them ', () => {
      expect(getRequiredPermissions(state, id)).toEqual(state.asset.data[id].requiredPermissions)
    })
  })
})

describe('when getting the video hash of an asset', () => {
  let id: string
  let videoHash: string | undefined

  beforeEach(() => {
    id = 'anAssetId'
  })

  describe('and there are no required permissions related to that asset', () => {
    it('should return the them ', () => {
      expect(getVideoHash(state, id)).toBeUndefined()
    })
  })

  describe('and there were fetched', () => {
    beforeEach(() => {
      videoHash = 'aVideoHash'
      state.asset.data = {
        [id]: { videoHash }
      }
    })

    it('should return the them ', () => {
      expect(getVideoHash(state, id)).toEqual(state.asset.data[id].videoHash)
    })
  })
})
