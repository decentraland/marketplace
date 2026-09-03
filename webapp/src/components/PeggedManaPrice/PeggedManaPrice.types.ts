import { Network } from '@dcl/schemas'

export type Props = {
  /** The listing amount in USD wei (1e18 = $1) — the `amount` of a `USD_PEGGED_MANA` trade asset. */
  usdWei: string
  /** The network the listing settles on; picks the MANA glyph. */
  network: Network
  /**
   * The marketplace this listing settles on — the trade's own `contract`. Required, and deliberately not
   * defaulted: each version holds its own MANA/USD aggregator, so pricing a V2 listing off another version's
   * feed would quote a rate it will never settle at. Null renders "price unavailable" rather than guessing.
   */
  marketplaceAddress: string | null
  /** Matches the sizes `Mana` accepts, so this drops in where a MANA price was. */
  size?: 'small' | 'medium' | 'large'
  className?: string
  manaClassName?: string
  inline?: boolean
}
