import { Rarity } from '@dcl/schemas'

/**
 * The rarity wash the shop paints behind an item on a card.
 *
 * Ported from the shop's draft RFC (decentraland/shop#409, treatment "A · tinted wash"), so both
 * storefronts colour a grid the same way. It is light at the centre, which keeps the artwork
 * readable and lets it recut against the fill, with colour gathering toward the edges. That is the
 * difference from `Rarity.getGradient`, the raw explorer gradient, which is saturated all the way
 * through and turns a grid into blocks of flat colour.
 *
 * The hues are the SHOP's rarity palette rather than `@dcl/schemas`' — the same values the card's own
 * rarity chip uses, so the wash and the chip agree. They diverge most at the top end, where the
 * marketplace's Exotic is a pale `#e4ffb8` against the shop's saturated `#9cd71e`.
 */
const SHOP_RARITY_HEX: Record<string, string> = {
  common: '#73d3d3',
  uncommon: '#ff8362',
  rare: '#34ce76',
  epic: '#289cff',
  legendary: '#a24bf3',
  exotic: '#9cd71e',
  mythic: '#ff4bed',
  unique: '#fea217'
}

const FALLBACK_HEX = '#e6e6e6'

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const rgba = ([r, g, b]: [number, number, number], alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`

/**
 * A CSS `background-image` for an item's media area. Returns the neutral wash for anything without a
 * rarity, so a NAME or a parcel is never painted as `common`.
 */
export function getRarityWash(rarity?: Rarity | string | null): string {
  const key = String(rarity ?? '').toLowerCase()
  const hex = SHOP_RARITY_HEX[key] ?? FALLBACK_HEX
  const color = toRgb(hex)
  return `radial-gradient(circle at 50% 38%, ${rgba(color, 0.04)} 0%, ${rgba(color, 0.3)} 50%, ${rgba(color, 0.62)} 100%)`
}
