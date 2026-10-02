import { ChainId } from '@dcl/schemas'
import { clearManaUsdRateCache, fetchManaUsdRate, usdWeiToManaWei, ManaUsdRate } from './manaRate'

/** The contract a trade settles on — what the caller reads off the trade and passes in. */
const MARKETPLACE = '0xmarketplace'
/** A second version on the same chain, for the cache-key case. */
const OTHER_MARKETPLACE = '0xothermarketplace'

const manaUsdAggregator = jest.fn()
const decimals = jest.fn()
const latestRoundData = jest.fn()

jest.mock('decentraland-dapps/dist/lib/eth', () => ({
  getNetworkProvider: jest.fn().mockResolvedValue({ request: jest.fn() })
}))

// The registry gate the module now runs the address through. Mirrors the real pair: getContractName maps a
// known address to its version and THROWS for an unknown one, which is what keeps an attacker-supplied
// address from being dialled.
jest.mock('decentraland-transactions', () => ({
  ContractName: { OffChainMarketplaceV2: 'OffChainMarketplaceV2', OffChainMarketplaceV3: 'OffChainMarketplaceV3' },
  getContractName: (address: string) => {
    const known: Record<string, string> = {
      '0xmarketplace': 'OffChainMarketplaceV2',
      '0xothermarketplace': 'OffChainMarketplaceV3'
    }
    const name = known[address.toLowerCase()]
    if (!name) {
      throw new Error(`Could not get a valid contract name for address ${address}`)
    }
    return name
  },
  getContract: (name: string) => ({
    address: name === 'OffChainMarketplaceV3' ? '0xothermarketplace' : '0xmarketplace',
    name,
    version: '1.0.0',
    abi: []
  })
}))

jest.mock('ethers', () => {
  // Annotated rather than asserted — see the note in the component specs.
  const actual: typeof import('ethers') = jest.requireActual('ethers')
  return {
    ethers: {
      ...actual.ethers,
      providers: { ...actual.ethers.providers, Web3Provider: class {} },
      Contract: class {
        constructor(public address: string) {}
        manaUsdAggregator = (): Promise<string> => manaUsdAggregator(this.address) as Promise<string>
        decimals = (): Promise<number> => decimals(this.address) as Promise<number>
        latestRoundData = (): Promise<unknown[]> => latestRoundData(this.address) as Promise<unknown[]>
      }
    }
  }
})

// $0.0669 per MANA, the shape a Chainlink feed returns: 8 decimals, the answer at index 1.
const ANSWER = { toString: () => '6686601' }
const round = (answer: { toString(): string }) => [0, answer, 0, 0, 0]

beforeEach(() => {
  jest.clearAllMocks()
  clearManaUsdRateCache()
  manaUsdAggregator.mockResolvedValue('0xaggregator')
  decimals.mockResolvedValue(8)
  latestRoundData.mockResolvedValue(round(ANSWER))
})

describe('when reading the MANA/USD rate', () => {
  /**
   * The rate has to come from the aggregator the MARKETPLACE names, not from a standalone oracle. Measured on
   * Polygon: `marketplace.manaUsdAggregator()` is `0xA1CbF3Fe…`, while the `ChainlinkOracle` entry in
   * decentraland-transactions is `0xe18B1361…` — a different contract, which does not even expose the same
   * interface. Reading it off the marketplace makes the displayed rate the settlement rate by construction.
   */
  it('should read the aggregator address from the marketplace the caller named', async () => {
    await fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)

    expect(manaUsdAggregator).toHaveBeenCalledWith('0xmarketplace')
    expect(decimals).toHaveBeenCalledWith('0xaggregator')
    expect(latestRoundData).toHaveBeenCalledWith('0xaggregator')
  })

  it('should return the answer and its decimals', async () => {
    const rate = await fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)

    expect(rate).toEqual({ answer: 6686601n, decimals: 8 })
  })

  it('should reuse the read within the TTL', async () => {
    await fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)
    await fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)

    // One read for a whole grid of cards, rather than one per price.
    expect(manaUsdAggregator).toHaveBeenCalledTimes(1)
  })

  /**
   * Two marketplace versions on one chain hold their own aggregators, so a chain-only cache key would serve
   * whichever was read first to both — pricing a V2 listing at V3's rate, which is the exact thing passing the
   * settlement contract is meant to prevent.
   */
  it('should not reuse one marketplace read for a different marketplace on the same chain', async () => {
    await fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)
    await fetchManaUsdRate(ChainId.MATIC_MAINNET, OTHER_MARKETPLACE)

    expect(manaUsdAggregator).toHaveBeenCalledTimes(2)
    expect(manaUsdAggregator).toHaveBeenCalledWith(MARKETPLACE)
    expect(manaUsdAggregator).toHaveBeenCalledWith(OTHER_MARKETPLACE)
  })

  /**
   * `marketplaceAddress` arrives from a server-supplied `trade.contract`. Every transacting path already
   * re-resolves it; this is the one read that would otherwise dial the raw string, and ethers v5 would treat
   * a non-address as an ENS name to go and look up.
   */
  it('should refuse an address the contract registry does not know', async () => {
    await expect(fetchManaUsdRate(ChainId.MATIC_MAINNET, '0xnotamarketplace')).rejects.toThrow(/valid contract name/)

    expect(manaUsdAggregator).not.toHaveBeenCalled()
  })

  it('should reject a non-positive rate instead of dividing by it', async () => {
    latestRoundData.mockResolvedValue(round({ toString: () => '0' }))

    await expect(fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)).rejects.toThrow(/non-positive/)
  })

  it('should reject when the tuple carries no rate at all', async () => {
    // Not a cast: if the decode shape ever changes, this must fail loudly rather than yield a nonsense price.
    latestRoundData.mockResolvedValue([0, undefined, 0, 0, 0] as unknown[])

    await expect(fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)).rejects.toThrow(/no rate/)
  })

  it('should not cache a failure', async () => {
    manaUsdAggregator.mockRejectedValueOnce(new Error('rpc down'))

    await expect(fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)).rejects.toThrow('rpc down')
    // A transient failure must not pin a broken price for the whole TTL.
    await expect(fetchManaUsdRate(ChainId.MATIC_MAINNET, MARKETPLACE)).resolves.toEqual({ answer: 6686601n, decimals: 8 })
  })
})

describe('when converting a USD-pegged amount to MANA', () => {
  const rate: ManaUsdRate = { answer: 6686601n, decimals: 8 }

  it('should convert at the oracle rate', () => {
    // THE PRODUCTION CASE. $0.50 at $0.06686601/MANA = 7.477640… MANA, i.e. 7477640732563525175 wei. The same
    // listing rendered as "0.5" before (its USD figure behind the MANA glyph) and then as "5 credits".
    expect(usdWeiToManaWei('500000000000000000', rate)).toBe('7477640732563525175')
  })

  it('should be exact for a whole dollar', () => {
    // $1 / 0.06686601 = 14.955281… MANA
    expect(usdWeiToManaWei('1000000000000000000', rate)).toBe('14955281465127050350')
  })

  it('should stay exact past the float range', () => {
    // A big listing must not drift through a double — the whole reason this is BigInt. $1M is 14,955,281.465…
    // MANA, and every digit of it has to survive.
    const oneMillionUsd = (10n ** 18n * 1_000_000n).toString()
    expect(usdWeiToManaWei(oneMillionUsd, rate)).toBe('14955281465127050350394767')
  })

  it('should return null on a malformed or negative amount', () => {
    expect(usdWeiToManaWei('', rate)).toBeNull()
    expect(usdWeiToManaWei('   ', rate)).toBeNull()
    expect(usdWeiToManaWei('not-a-number', rate)).toBeNull()
    expect(usdWeiToManaWei('-1000', rate)).toBeNull()
  })

  it('should refuse to divide by a non-positive rate', () => {
    // `fetchManaUsdRate` already rejects those, but this function is exported and takes a rate from any
    // caller — a RangeError thrown out of a render is not an acceptable failure mode for a price.
    expect(usdWeiToManaWei('500000000000000000', { answer: 0n, decimals: 8 })).toBeNull()
    expect(usdWeiToManaWei('500000000000000000', { answer: -1n, decimals: 8 })).toBeNull()
  })

  it('should return zero for a zero amount rather than null', () => {
    // Zero is a price the feed can legitimately report; absent is not.
    expect(usdWeiToManaWei('0', rate)).toBe('0')
  })
})
