export type Props = {
  /** The listing amount in USD wei (1e18 = $1) — the `amount` of a `USD_PEGGED_MANA` trade asset. */
  usdWei: string
  /** Matches the sizes the `Mana` component accepts, so a credits price can drop in where MANA was. */
  size?: 'small' | 'medium' | 'large'
  /** Render the dollar equivalent next to the amount, e.g. "ⓒ 6 ($0.60)". */
  showUsd?: boolean
  className?: string
}
