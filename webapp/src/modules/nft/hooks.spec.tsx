import { useSelector } from 'react-redux'
import { act, renderHook, waitFor } from '@testing-library/react'
import { ChainId, NFTCategory, Network } from '@dcl/schemas'
import { RootState } from '../reducer'
import { VendorName } from '../vendor'
import { EstateSnapshot, getFingerprint, readEstateSnapshot } from './estate/utils'
import { EstateSnapshotStatus, useEstateSnapshot, useFingerprint } from './hooks'
import { NFT } from './types'

jest.mock(
  'react-redux',
  () =>
    ({
      ...jest.requireActual('react-redux'),
      useSelector: jest.fn()
    }) as unknown
)

jest.mock(
  './estate/utils',
  () =>
    ({
      ...jest.requireActual('./estate/utils'),
      getFingerprint: jest.fn(),
      readEstateSnapshot: jest.fn()
    }) as unknown
)

const FINGERPRINT = '0xa7fe55af6f4ca09a346312be9b76dba38436d52611e279e09440d564a457115e'
const PARCELS = [
  { x: -102, y: 81 },
  { x: -101, y: 81 }
]

const appState: Partial<RootState> = {
  contract: {
    loading: [],
    error: null,
    hasFetched: false,
    data: [
      {
        name: 'estate',
        chainId: ChainId.ETHEREUM_SEPOLIA,
        address: '0xestate',
        network: Network.ETHEREUM,
        vendor: VendorName.DECENTRALAND,
        category: NFTCategory.ESTATE
      }
    ]
  }
}

const buildEstate = (parcels = PARCELS): NFT =>
  ({
    id: 'estate-id',
    tokenId: '6503',
    chainId: ChainId.ETHEREUM_SEPOLIA,
    category: NFTCategory.ESTATE,
    data: { estate: { size: parcels.length, description: null, parcels } }
  }) as NFT

const buildSnapshot = (parcels = PARCELS, fingerprint = FINGERPRINT): EstateSnapshot => ({
  blockNumber: 25945710,
  landIds: parcels.map((_parcel, index) => String(index)),
  parcels,
  fingerprint
})

// A different Estate, to key the effect off a different readKey on navigation.
const OTHER_PARCELS = [
  { x: 9, y: 9 },
  { x: 9, y: 8 }
]
const buildOtherEstate = (): NFT =>
  ({
    id: 'estate-other',
    tokenId: '6504',
    chainId: ChainId.ETHEREUM_SEPOLIA,
    category: NFTCategory.ESTATE,
    data: { estate: { size: OTHER_PARCELS.length, description: null, parcels: OTHER_PARCELS } }
  }) as NFT

// A promise whose resolution is controlled by the test, to order two in-flight reads.
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(r => {
    resolve = r
  })
  return { promise, resolve }
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(useSelector as jest.Mock).mockImplementation((callback: (state: unknown) => unknown) => callback(appState))
})

describe('useFingerprint', () => {
  describe('when the nft is not an estate', () => {
    it('should not read the registry', () => {
      const { result } = renderHook(() => useFingerprint({ id: 'test-id', category: NFTCategory.PARCEL } as NFT))

      expect(result.current).toEqual([undefined, false])
      expect(getFingerprint).not.toHaveBeenCalled()
    })
  })

  describe('when the nft is an estate', () => {
    it("should return the registry's current fingerprint", async () => {
      ;(getFingerprint as jest.Mock).mockResolvedValue(FINGERPRINT)

      const { result } = renderHook(() => useFingerprint(buildEstate()))

      await waitFor(() => expect(result.current[1]).toBe(false))
      expect(result.current[0]).toBe(FINGERPRINT)
    })
  })
})

describe('useEstateSnapshot', () => {
  describe('when the asset is not an estate', () => {
    it('should not block, and should not read the registry', async () => {
      const { result } = renderHook(() => useEstateSnapshot({ id: 'test-id', category: NFTCategory.PARCEL } as NFT))

      expect(result.current.status).toBe(EstateSnapshotStatus.NOT_APPLICABLE)
      expect(readEstateSnapshot).not.toHaveBeenCalled()
      await expect(result.current.confirm()).resolves.toBe(true)
    })
  })

  describe('when the registry holds the parcels being shown', () => {
    beforeEach(() => {
      ;(readEstateSnapshot as jest.Mock).mockResolvedValue(buildSnapshot())
    })

    it('should hand out the fingerprint of the composition it read', async () => {
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.READY))
      expect(result.current.fingerprint).toBe(FINGERPRINT)
    })

    it('should withhold the fingerprint until the registry has been read', () => {
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      expect(result.current.status).toBe(EstateSnapshotStatus.LOADING)
      expect(result.current.fingerprint).toBeUndefined()
    })

    // The composition the user reviewed is the one they act on: a store refresh
    // handing over a new object for the same estate must not read it again.
    it('should not read the registry again when the asset object changes', async () => {
      const { result, rerender } = renderHook(({ nft }: { nft: NFT }) => useEstateSnapshot(nft), {
        initialProps: { nft: buildEstate() }
      })

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.READY))
      rerender({ nft: buildEstate() })
      rerender({ nft: buildEstate() })

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.READY))
      expect(readEstateSnapshot).toHaveBeenCalledTimes(1)
    })
  })

  // Jarvis P1: on A -> B -> A the first A read can resolve after the second and must not overwrite it.
  describe('when the same estate is navigated away from and back to', () => {
    it('should not let an earlier read of it overwrite a later one', async () => {
      const first = deferred<EstateSnapshot>()
      const second = deferred<EstateSnapshot>()
      ;(readEstateSnapshot as jest.Mock)
        .mockReturnValueOnce(first.promise) // read for A (first mount)
        .mockResolvedValueOnce(buildSnapshot(OTHER_PARCELS)) // read for B
        .mockReturnValueOnce(second.promise) // read for A (after returning)

      const { result, rerender } = renderHook(({ nft }: { nft: NFT }) => useEstateSnapshot(nft), {
        initialProps: { nft: buildEstate() }
      })

      rerender({ nft: buildOtherEstate() }) // navigate to B
      rerender({ nft: buildEstate() }) // back to A

      // The later A read resolves first with the fresh composition, then the earlier one resolves stale.
      const fresh = buildSnapshot(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 }
        ],
        '0xfresh'
      )
      const stale = buildSnapshot([{ x: 1, y: 1 }], '0xstale')
      act(() => {
        second.resolve(fresh)
        first.resolve(stale)
      })

      await waitFor(() => expect(result.current.snapshot).toBeDefined())
      expect(result.current.snapshot).toBe(fresh)
    })
  })

  describe('when the registry holds a different set of parcels than the one being shown', () => {
    beforeEach(() => {
      ;(readEstateSnapshot as jest.Mock).mockResolvedValue(buildSnapshot([PARCELS[0]]))
    })

    it('should block and withhold the fingerprint', async () => {
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.OUT_OF_SYNC))
      expect(result.current.fingerprint).toBeUndefined()
    })

    it('should report what the registry holds', async () => {
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.OUT_OF_SYNC))
      expect(result.current.snapshot?.parcels).toEqual([PARCELS[0]])
    })
  })

  describe('when the registry cannot be read', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined)
      ;(readEstateSnapshot as jest.Mock).mockRejectedValue(new Error('unreachable'))
    })

    it('should block and withhold the fingerprint', async () => {
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.UNAVAILABLE))
      expect(result.current.fingerprint).toBeUndefined()
    })
  })

  describe('retry', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined)
    })

    // The gate refuses to act on a composition it could not read, so a momentary
    // RPC problem must not keep a flow closed until it is reopened.
    it('should read the registry again after a failed read', async () => {
      ;(readEstateSnapshot as jest.Mock).mockRejectedValueOnce(new Error('unreachable')).mockResolvedValueOnce(buildSnapshot())
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.UNAVAILABLE))
      act(() => result.current.retry())

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.READY))
      expect(result.current.fingerprint).toBe(FINGERPRINT)
      expect(readEstateSnapshot).toHaveBeenCalledTimes(2)
    })
  })

  describe('confirm', () => {
    beforeEach(() => {
      ;(readEstateSnapshot as jest.Mock).mockResolvedValue(buildSnapshot())
    })

    it('should hold when the registry still reports the fingerprint that was read', async () => {
      ;(getFingerprint as jest.Mock).mockResolvedValue(FINGERPRINT)
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.READY))
      await expect(result.current.confirm()).resolves.toBe(true)
    })

    it('should not hold once the registry reports another fingerprint', async () => {
      ;(getFingerprint as jest.Mock).mockResolvedValue('0xdeadbeef')
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.READY))
      await expect(result.current.confirm()).resolves.toBe(false)
    })

    it('should not hold, rather than reject, when the registry cannot be re-read', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined)
      ;(getFingerprint as jest.Mock).mockRejectedValue(new Error('unreachable'))
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      await waitFor(() => expect(result.current.status).toBe(EstateSnapshotStatus.READY))
      await expect(result.current.confirm()).resolves.toBe(false)
    })

    it('should not hold before the registry has been read', async () => {
      const { result } = renderHook(() => useEstateSnapshot(buildEstate()))

      expect(result.current.status).toBe(EstateSnapshotStatus.LOADING)
      await expect(result.current.confirm()).resolves.toBe(false)
    })
  })
})
