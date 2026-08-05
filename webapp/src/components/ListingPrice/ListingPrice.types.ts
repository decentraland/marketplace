import { Network } from '@dcl/schemas'

export type Props = {
  /** MANA wei, or USD wei when the backing trade is USD-pegged. */
  price: string
  network: Network
  /**
   * The trade backing this listing, when there is one. Its received asset type is the only thing that
   * says which unit `price` is in — see `modules/trade/denomination`. Omit for prices that cannot be
   * USD-pegged (legacy on-chain orders, collection-store mints, rentals, subgraph sale history).
   */
  tradeId?: string
  /** Append the fiat equivalent, e.g. "◈ 5 ($0.34)" / "ⓒ 5 ($0.50)". */
  showFiat?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
  /** Applied to the MANA glyph only, so existing per-surface MANA styling keeps working. */
  manaClassName?: string
  /** Forwarded to the MANA glyph. No effect on the credits branch, which is inline by construction. */
  inline?: boolean
  /** Forwarded to the MANA glyph; the credits glyph always carries its own tooltip. */
  showTooltip?: boolean
}
