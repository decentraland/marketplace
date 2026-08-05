import { Network } from '@dcl/schemas'

export type Props = {
  /** The listing amount in USD wei (1e18 = $1) — the `amount` of a `USD_PEGGED_MANA` trade asset. */
  usdWei: string
  /** The network the listing settles on; picks the oracle and the MANA glyph. */
  network: Network
  /** Matches the sizes `Mana` accepts, so this drops in where a MANA price was. */
  size?: 'small' | 'medium' | 'large'
  className?: string
  manaClassName?: string
  inline?: boolean
}
