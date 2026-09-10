import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { EstateRegistry__factory } from '../../../contracts'
import { Contract } from '../../vendor/services'
import { NFT } from '../types'

// A LAND token id packs both coordinates as two's-complement int128 halves: x in
// the high half, y in the low half.
const LAND_COORD_BITS = 128
const LAND_COORD_MASK = (BigInt(1) << BigInt(LAND_COORD_BITS)) - BigInt(1)
const LAND_COORD_SIGN_BIT = BigInt(1) << BigInt(LAND_COORD_BITS - 1)

// Deployed at the same address on every chain the Estate registry lives on.
const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'
const MULTICALL3_ABI = [
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[])'
]

// How many `estateLandIds` reads travel in a single call, and how many of those
// calls are in flight at once. The largest Estate on mainnet holds 9,639 LANDs,
// which these values cover in a handful of round trips.
const LAND_IDS_PER_CALL = 500
const CONCURRENT_CALLS = 6

export type EstateParcel = { x: number; y: number }

// An Estate's composition as the registry holds it, read at a single block so
// that `parcels` and `fingerprint` are guaranteed to describe the same state.
export type EstateSnapshot = {
  blockNumber: number
  landIds: string[]
  parcels: EstateParcel[]
  fingerprint: string
}

export const getSelection = (estate: NFT['data']['estate']) => {
  return estate!.parcels.map(pair => ({
    x: +pair.x,
    y: +pair.y
  }))
}

export const getCenter = (selection: { x: number; y: number }[]) => {
  const xs = [...new Set(selection.map(coords => coords.x).sort())]
  const ys = [...new Set(selection.map(coords => coords.y).sort())]
  const x = xs[(xs.length / 2) | 0]
  const y = ys[(ys.length / 2) | 0]
  return [x, y]
}

function toSignedCoord(half: bigint): number {
  return Number(half & LAND_COORD_SIGN_BIT ? half - (BigInt(1) << BigInt(LAND_COORD_BITS)) : half)
}

// Unpacks a LAND token id into its coordinates. Kept local so that reading a
// composition costs one call per batch of ids instead of one call per parcel.
export function decodeLandTokenId(landId: string): EstateParcel {
  const id = BigInt(landId)
  return {
    x: toSignedCoord(id >> BigInt(LAND_COORD_BITS)),
    y: toSignedCoord(id & LAND_COORD_MASK)
  }
}

// The registry's `getFingerprintV2`, computed off-chain. The hash covers the
// land ids in the order the registry stores them, so the ids have to be passed
// in exactly that order.
export function computeEstateFingerprint(estateId: string, landIds: string[]): string {
  return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['string', 'uint256', 'uint256[]'], ['estateId', estateId, landIds]))
}

// Compares two compositions as sets — the registry's storage order is an
// implementation detail of how LANDs were added and removed, so it carries no
// meaning for a caller comparing what it holds against what it displays.
export function isSameEstateComposition(a: EstateParcel[], b: EstateParcel[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  const toKey = (parcel: EstateParcel) => `${+parcel.x},${+parcel.y}`
  const left = new Set(a.map(toKey))
  const right = new Set(b.map(toKey))
  // Distinct counts as well as membership, so that a repeated coordinate on one
  // side cannot stand in for a coordinate that is missing from it.
  return left.size === right.size && [...right].every(coord => left.has(coord))
}

async function mapWithConcurrency<T>(count: number, limit: number, task: (index: number) => Promise<T>): Promise<T[]> {
  const results = new Array<T>(count)
  let next = 0
  const workers = new Array(Math.min(limit, count)).fill(null).map(async () => {
    let index = next++
    while (index < count) {
      results[index] = await task(index)
      index = next++
    }
  })
  await Promise.all(workers)
  return results
}

async function readLandIdsWithMulticall(
  provider: ethers.providers.Provider,
  estateAddress: string,
  estateId: string,
  size: number,
  blockTag: number
): Promise<string[] | null> {
  const code = await provider.getCode(MULTICALL3_ADDRESS, blockTag)
  if (code === '0x') {
    return null
  }

  const registry = EstateRegistry__factory.createInterface()
  const multicall = new ethers.Contract(MULTICALL3_ADDRESS, MULTICALL3_ABI, provider)
  const batchCount = Math.ceil(size / LAND_IDS_PER_CALL)

  const batches = await mapWithConcurrency(batchCount, CONCURRENT_CALLS, async batch => {
    const from = batch * LAND_IDS_PER_CALL
    const to = Math.min(from + LAND_IDS_PER_CALL, size)
    const calls = []
    for (let index = from; index < to; index++) {
      calls.push({
        target: estateAddress,
        allowFailure: false,
        callData: registry.encodeFunctionData('estateLandIds', [estateId, index])
      })
    }
    const responses = (await multicall.aggregate3(calls, { blockTag })) as { returnData: string }[]
    return responses.map(response => ethers.BigNumber.from(response.returnData).toString())
  })

  return batches.flat()
}

async function readLandIdsOneByOne(
  registry: ReturnType<typeof EstateRegistry__factory.connect>,
  estateId: string,
  size: number,
  blockTag: number
): Promise<string[]> {
  return mapWithConcurrency(size, CONCURRENT_CALLS, async index => (await registry.estateLandIds(estateId, index, { blockTag })).toString())
}

// Reads which LANDs the registry currently holds for an Estate, together with
// the fingerprint that identifies that exact composition.
//
// Every read is pinned to one block and the fingerprint is recomputed from the
// ids that came back, so a composition that changed while the ids were being
// paginated is rejected instead of returned as a mix of two states.
export async function readEstateSnapshot(estateId: string, estateContract: Contract, chainId: ChainId): Promise<EstateSnapshot> {
  const networkProvider = await getNetworkProvider(chainId)
  const provider = new ethers.providers.Web3Provider(networkProvider)
  const registry = EstateRegistry__factory.connect(estateContract.address, provider)

  const blockNumber = await provider.getBlockNumber()
  const size = (await registry.getEstateSize(estateId, { blockTag: blockNumber })).toNumber()

  const landIds =
    (await readLandIdsWithMulticall(provider, estateContract.address, estateId, size, blockNumber)) ??
    (await readLandIdsOneByOne(registry, estateId, size, blockNumber))

  const fingerprint = await registry.getFingerprintV2(estateId, { blockTag: blockNumber })

  if (computeEstateFingerprint(estateId, landIds) !== fingerprint) {
    throw new Error(`The LANDs read for estate ${estateId} do not add up to its fingerprint`)
  }

  return {
    blockNumber,
    landIds,
    parcels: landIds.map(decodeLandTokenId),
    fingerprint
  }
}

export async function getFingerprint(estateId: string, estateContract: Contract, chainId: ChainId) {
  const provider = await getNetworkProvider(chainId)
  if (provider) {
    const estateRegistry = EstateRegistry__factory.connect(estateContract.address, new ethers.providers.Web3Provider(provider))
    return estateRegistry.getFingerprintV2(estateId)
  }
}
