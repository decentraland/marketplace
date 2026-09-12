import { ChainId, NFTCategory } from '@dcl/schemas'
import { Contract } from '../../vendor/services'
import { NFT } from '../types'
import { applyEstateSnapshot, computeEstateFingerprint, decodeLandTokenId, isSameEstateComposition, readEstateSnapshot } from './utils'

const getBlockNumber = jest.fn()
const getCode = jest.fn()
const getEstateSize = jest.fn()
const estateLandIds = jest.fn()
const getFingerprintV2 = jest.fn()
const aggregate3 = jest.fn()

jest.mock('decentraland-dapps/dist/lib/eth', () => ({
  getNetworkProvider: jest.fn().mockResolvedValue({ request: jest.fn() })
}))

jest.mock('ethers', () => {
  // Annotated rather than asserted so that the spread below keeps its real types.
  const actual: typeof import('ethers') = jest.requireActual('ethers')
  return {
    ethers: {
      ...actual.ethers,
      providers: {
        ...actual.ethers.providers,
        Web3Provider: class {
          getBlockNumber = (): Promise<number> => getBlockNumber() as Promise<number>
          getCode = (address: string, blockTag: number): Promise<string> => getCode(address, blockTag) as Promise<string>
        }
      },
      Contract: class {
        aggregate3 = (calls: unknown[], overrides: unknown): Promise<unknown> => aggregate3(calls, overrides) as Promise<unknown>
      }
    }
  }
})

jest.mock('../../../contracts', () => ({
  EstateRegistry__factory: {
    connect: () => ({
      getEstateSize: (estateId: string, overrides: unknown): Promise<{ toNumber: () => number }> =>
        getEstateSize(estateId, overrides) as Promise<{ toNumber: () => number }>,
      estateLandIds: (estateId: string, index: number, overrides: unknown): Promise<{ toString: () => string }> =>
        estateLandIds(estateId, index, overrides) as Promise<{ toString: () => string }>,
      getFingerprintV2: (estateId: string, overrides: unknown): Promise<string> => getFingerprintV2(estateId, overrides) as Promise<string>
    }),
    createInterface: () => ({
      encodeFunctionData: (name: string, args: unknown[]) => `${name}(${JSON.stringify(args)})`
    })
  }
}))

// Estate 6503 on mainnet, read from the registry: the land ids in the order it
// stores them, the coordinates they encode, and the fingerprint it reports.
const ESTATE_ID = '6503'
const LAND_IDS = [
  '115792089237316195423570985008687907818561183239704840766193374049872772071505',
  '115792089237316195423570985008687907818561183239704840766193374049872772071506',
  '115792089237316195423570985008687907818901465606625779229656748657304540282961',
  '115792089237316195423570985008687907818901465606625779229656748657304540282962',
  '115792089237316195423570985008687907818561183239704840766193374049872772071507',
  '115792089237316195423570985008687907818901465606625779229656748657304540282963',
  '115792089237316195423570985008687907819241747973546717693120123264736308494419',
  '115792089237316195423570985008687907819241747973546717693120123264736308494418',
  '115792089237316195423570985008687907819241747973546717693120123264736308494417'
]
const PARCELS = [
  { x: -102, y: 81 },
  { x: -102, y: 82 },
  { x: -101, y: 81 },
  { x: -101, y: 82 },
  { x: -102, y: 83 },
  { x: -101, y: 83 },
  { x: -100, y: 83 },
  { x: -100, y: 82 },
  { x: -100, y: 81 }
]
const FINGERPRINT = '0xa7fe55af6f4ca09a346312be9b76dba38436d52611e279e09440d564a457115e'

const BLOCK = 25945710
const MULTICALL3 = '0xcA11bde05977b3631167028862bE2a173976CA11'
const estateContract = { address: '0xestate', chainId: ChainId.ETHEREUM_MAINNET } as Contract

// What `aggregate3` hands back for a land id: the value, abi-encoded.
const asReturnData = (landId: string) => ({
  success: true,
  returnData: `0x${BigInt(landId).toString(16).padStart(64, '0')}`
})

describe('decodeLandTokenId', () => {
  it('should decode the land ids of a real estate into its coordinates', () => {
    expect(LAND_IDS.map(decodeLandTokenId)).toEqual(PARCELS)
  })

  // Both halves are two's complement, so each quadrant has to be exercised. The
  // ids are what the LAND registry's `encodeTokenId` returns for these coordinates.
  it.each([
    ['0', 0, 0],
    ['340282366920938463463374607431768211457', 1, 1],
    ['115792089237316195423570985008687907853269984665640564039457584007913129639935', -1, -1],
    ['680564733841876926926749214863536422911', 1, -1],
    ['115792089237316195423570985008687907852929702298719625575994209400481361428481', -1, 1],
    ['51382637405061707982969565722196999929706', 150, -150],
    ['115792089237316195423570985008687907802227629627499794519951392893147897921686', -150, 150],
    ['25521177519070384759753095557382615859147', 74, -53]
  ])('should decode %s as (%i, %i)', (landId, x, y) => {
    expect(decodeLandTokenId(landId)).toEqual({ x, y })
  })
})

describe('computeEstateFingerprint', () => {
  it("should reproduce the registry's fingerprint from the land ids in the order it stores them", () => {
    expect(computeEstateFingerprint(ESTATE_ID, LAND_IDS)).toBe(FINGERPRINT)
  })

  // The hash covers the array, not the set — which is why a composition has to be
  // read in the registry's own order rather than in the order it is displayed in.
  it('should not reproduce it from the same land ids in another order', () => {
    const reordered = [...LAND_IDS].reverse()
    expect(computeEstateFingerprint(ESTATE_ID, reordered)).not.toBe(FINGERPRINT)
  })

  it('should not reproduce it for another estate id', () => {
    expect(computeEstateFingerprint('6504', LAND_IDS)).not.toBe(FINGERPRINT)
  })
})

describe('isSameEstateComposition', () => {
  it('should hold for the same parcels in another order', () => {
    expect(isSameEstateComposition(PARCELS, [...PARCELS].reverse())).toBe(true)
  })

  it('should not hold when a parcel is missing', () => {
    expect(isSameEstateComposition(PARCELS, PARCELS.slice(1))).toBe(false)
  })

  it('should not hold when a parcel was swapped for another', () => {
    const swapped = [...PARCELS.slice(1), { x: -99, y: 81 }]
    expect(isSameEstateComposition(PARCELS, swapped)).toBe(false)
  })

  it('should not hold when one side repeats a coordinate the other is missing', () => {
    const withDuplicate = [...PARCELS.slice(0, -1), PARCELS[0]]
    expect(isSameEstateComposition(PARCELS, withDuplicate)).toBe(false)
    expect(isSameEstateComposition(withDuplicate, PARCELS)).toBe(false)
  })

  it('should compare coordinates by value rather than by type', () => {
    const asStrings = PARCELS.map(parcel => ({ x: String(parcel.x), y: String(parcel.y) })) as unknown as typeof PARCELS
    expect(isSameEstateComposition(PARCELS, asStrings)).toBe(true)
  })
})

// What draws an Estate — the atlas selection, its centre, the LAND count — all reads `data.estate`,
// so substituting it there is what puts the registry's composition on screen instead of the indexed one.
describe('applyEstateSnapshot', () => {
  const nft = {
    tokenId: ESTATE_ID,
    category: NFTCategory.ESTATE,
    name: 'an estate',
    data: {
      estate: {
        size: 2,
        description: 'unchanged',
        parcels: [
          { x: 0, y: 0 },
          { x: 0, y: 1 }
        ]
      }
    }
  } as unknown as NFT

  const snapshot = { blockNumber: 1, landIds: LAND_IDS, parcels: PARCELS, fingerprint: FINGERPRINT }

  it('should replace the parcels and the size with the ones the registry holds', () => {
    const applied = applyEstateSnapshot(nft, snapshot)

    expect(applied.data.estate?.parcels).toEqual(PARCELS)
    expect(applied.data.estate?.size).toBe(PARCELS.length)
  })

  it('should leave the rest of the asset alone', () => {
    const applied = applyEstateSnapshot(nft, snapshot)

    expect(applied.name).toBe(nft.name)
    expect(applied.data.estate?.description).toBe('unchanged')
    expect(nft.data.estate?.parcels).toHaveLength(2)
  })

  it('should pass a non-estate through untouched', () => {
    const parcel = { category: NFTCategory.PARCEL, data: {} } as unknown as NFT

    expect(applyEstateSnapshot(parcel, snapshot)).toBe(parcel)
  })
})

describe('readEstateSnapshot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getBlockNumber.mockResolvedValue(BLOCK)
    getEstateSize.mockResolvedValue({ toNumber: () => LAND_IDS.length })
    getFingerprintV2.mockResolvedValue(FINGERPRINT)
  })

  describe('when the multicall contract is deployed', () => {
    beforeEach(() => {
      getCode.mockResolvedValue('0x60806040')
      aggregate3.mockImplementation((calls: unknown[]) => {
        const indexes = (calls as { callData: string }[]).map(
          call => JSON.parse(call.callData.slice('estateLandIds('.length, -1))[1] as number
        )
        return Promise.resolve(indexes.map(index => asReturnData(LAND_IDS[index])))
      })
    })

    it('should return the composition and the fingerprint the registry reports', async () => {
      const snapshot = await readEstateSnapshot(ESTATE_ID, estateContract, ChainId.ETHEREUM_MAINNET)

      expect(snapshot).toEqual({
        blockNumber: BLOCK,
        landIds: LAND_IDS,
        parcels: PARCELS,
        fingerprint: FINGERPRINT
      })
    })

    it('should read every value at the same block', async () => {
      await readEstateSnapshot(ESTATE_ID, estateContract, ChainId.ETHEREUM_MAINNET)

      expect(getEstateSize).toHaveBeenCalledWith(ESTATE_ID, { blockTag: BLOCK })
      expect(getFingerprintV2).toHaveBeenCalledWith(ESTATE_ID, { blockTag: BLOCK })
      expect(getCode).toHaveBeenCalledWith(MULTICALL3, BLOCK)
      expect(aggregate3).toHaveBeenCalledWith(expect.anything(), { blockTag: BLOCK })
    })

    it('should not read the land ids one at a time', async () => {
      await readEstateSnapshot(ESTATE_ID, estateContract, ChainId.ETHEREUM_MAINNET)

      expect(estateLandIds).not.toHaveBeenCalled()
    })
  })

  // Every other case here fits in one `aggregate3`. This one spans several, which is where the
  // chunk arithmetic and the cross-batch ordering live — batches resolve out of order under
  // concurrency, so the ids have to land at their own index rather than in completion order.
  describe('when the estate needs more than one multicall batch', () => {
    // Comfortably over LAND_IDS_PER_CALL, and not a multiple of it, so the last batch is partial.
    const MANY_LAND_IDS = Array.from({ length: 1201 }, (_, index) => String(BigInt('0x' + 'ab'.repeat(16)) + BigInt(index)))
    const MANY_FINGERPRINT = computeEstateFingerprint(ESTATE_ID, MANY_LAND_IDS)

    beforeEach(() => {
      getEstateSize.mockResolvedValue({ toNumber: () => MANY_LAND_IDS.length })
      getFingerprintV2.mockResolvedValue(MANY_FINGERPRINT)
      getCode.mockResolvedValue('0x60806040')
      aggregate3.mockImplementation((calls: unknown[]) => {
        const indexes = (calls as { callData: string }[]).map(
          call => JSON.parse(call.callData.slice('estateLandIds('.length, -1))[1] as number
        )
        // Later batches resolve first, so a concurrency bug would reorder the result.
        const delay = MANY_LAND_IDS.length - indexes[0]
        return new Promise(resolve => setTimeout(() => resolve(indexes.map(index => asReturnData(MANY_LAND_IDS[index]))), delay % 5))
      })
    })

    it('should return every land id, in the registry order, across all batches', async () => {
      const snapshot = await readEstateSnapshot(ESTATE_ID, estateContract, ChainId.ETHEREUM_MAINNET)

      expect(snapshot.landIds).toEqual(MANY_LAND_IDS)
      expect(snapshot.fingerprint).toBe(MANY_FINGERPRINT)
    })

    it('should split the reads into whole batches plus a partial last one', async () => {
      await readEstateSnapshot(ESTATE_ID, estateContract, ChainId.ETHEREUM_MAINNET)

      const batchSizes = aggregate3.mock.calls.map(([calls]: [unknown[]]) => calls.length)
      expect(batchSizes.reduce((total, size) => total + size, 0)).toBe(MANY_LAND_IDS.length)
      expect(batchSizes).toHaveLength(3)
      expect(batchSizes[batchSizes.length - 1]).toBe(MANY_LAND_IDS.length % 500)
    })
  })

  describe('when the multicall contract is not deployed', () => {
    beforeEach(() => {
      getCode.mockResolvedValue('0x')
      estateLandIds.mockImplementation((_estateId: string, index: number) => Promise.resolve({ toString: () => LAND_IDS[index] }))
    })

    it('should read the land ids one at a time, at the same block', async () => {
      const snapshot = await readEstateSnapshot(ESTATE_ID, estateContract, ChainId.ETHEREUM_MAINNET)

      expect(snapshot.landIds).toEqual(LAND_IDS)
      expect(snapshot.fingerprint).toBe(FINGERPRINT)
      expect(estateLandIds).toHaveBeenCalledTimes(LAND_IDS.length)
      expect(estateLandIds).toHaveBeenCalledWith(ESTATE_ID, 0, { blockTag: BLOCK })
    })
  })

  // A composition that moved while its land ids were being paginated would come
  // back as a mix of two states, which no fingerprint describes.
  describe('when the land ids do not add up to the fingerprint the registry reports', () => {
    beforeEach(() => {
      getCode.mockResolvedValue('0x60806040')
      aggregate3.mockResolvedValue(LAND_IDS.slice(0, -1).concat(LAND_IDS[0]).map(asReturnData))
    })

    it('should reject instead of returning the composition', async () => {
      await expect(readEstateSnapshot(ESTATE_ID, estateContract, ChainId.ETHEREUM_MAINNET)).rejects.toThrow(
        `The LANDs read for estate ${ESTATE_ID} do not add up to its fingerprint`
      )
    })
  })
})
