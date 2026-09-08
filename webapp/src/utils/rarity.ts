import type { CSSProperties } from 'react'
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
const NEUTRAL_RGB: [number, number, number] = [230, 230, 230]

function rarityHex(rarity?: Rarity | string | null): string {
  return SHOP_RARITY_HEX[String(rarity ?? '').toLowerCase()] ?? FALLBACK_HEX
}

function toRgb(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(h)) return null
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const rgba = ([r, g, b]: [number, number, number], alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`

/**
 * A CSS `background-image` for an item's media area. Returns the neutral wash for anything without a
 * rarity, so a NAME or a parcel is never painted as `common`.
 */
export function getRarityWash(rarity?: Rarity | string | null): string {
  const color = toRgb(rarityHex(rarity)) ?? NEUTRAL_RGB
  return `radial-gradient(circle at 50% 38%, ${rgba(color, 0.04)} 0%, ${rgba(color, 0.3)} 50%, ${rgba(color, 0.62)} 100%)`
}

/**
 * Glow-only palette, ported with the shop's reasoning intact.
 *
 * Exotic's `#9cd71e` is a yellow-green that goes radioactive blown up to a page-sized light, and
 * browns as it fades: the purple field's complement sits near hue 100, so a colour close to it mixes
 * to mud on the way out. Exotic moves to a green clear of that and gives up 15% of the shared core
 * saturation, the hue being what keeps it out of the mud and the punch being what made it glare.
 * Rare moves to a jade far enough round to stay distinct from it. Chips, filters and the card wash
 * keep their own tokens.
 */
const GLOW_OVERRIDES: Record<string, { hex: string; saturation?: number }> = {
  exotic: { hex: '#44c75b', saturation: 0.81 },
  rare: { hex: '#3fd39a' }
}

const DEFAULT_GLOW_SATURATION = 0.95
const DEFAULT_GLOW_LIGHTNESS = 0.66
const UNPARSEABLE_RGB: [number, number, number] = [160, 155, 168]

function glowHex(rarity?: Rarity | string | null): string {
  const key = String(rarity ?? '').toLowerCase()
  return GLOW_OVERRIDES[key]?.hex ?? rarityHex(rarity)
}

/**
 * The glow's outer halo, as a bare `R G B` triple for the `rgb(R G B / a)` stops that need the same
 * hue at more than one alpha.
 */
export function getRarityGlowRgb(rarity?: Rarity | string | null): string {
  return (toRgb(glowHex(rarity)) ?? UNPARSEABLE_RGB).join(' ')
}

/**
 * The glow's hot centre: the same hue pushed to near-max saturation at a fixed lightness.
 *
 * This levels the rarities out. Legendary and Epic sit close to the page's own purple and sink into
 * it at their token value, while Unique is already bright, so without the push some items would be
 * backlit and others barely lit. Fixing lightness means every item is backlit as strongly and only
 * the hue changes.
 */
export function getRarityGlowCoreRgb(rarity?: Rarity | string | null, lightness = DEFAULT_GLOW_LIGHTNESS, saturation?: number): string {
  const rgb = toRgb(glowHex(rarity))
  if (!rgb) return UNPARSEABLE_RGB.join(' ')

  const key = String(rarity ?? '').toLowerCase()
  const sat = saturation ?? GLOW_OVERRIDES[key]?.saturation ?? DEFAULT_GLOW_SATURATION
  const [r, g, b] = rgb.map(channel => channel / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  // Achromatic, i.e. the neutral fallback. There is no hue to saturate and pretending otherwise would
  // invent one, since grey has a hue angle of 0, which is red.
  if (!delta) return rgb.join(' ')

  let hue: number
  if (max === r) hue = (g - b) / delta
  else if (max === g) hue = (b - r) / delta + 2
  else hue = (r - g) / delta + 4
  hue = (((hue * 60) % 360) + 360) % 360

  const chroma = (1 - Math.abs(2 * lightness - 1)) * sat
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const lift = lightness - chroma / 2
  const sector = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second]
  ][Math.floor(hue / 60) % 6]

  return sector.map(channel => Math.round((channel + lift) * 255)).join(' ')
}

/**
 * The custom properties the `rarity-glow` class reads, for a detail page's preview wrapper.
 *
 * Two values rather than one because the gradient needs the same hue at more than one alpha, and its
 * centre is a different, saturated colour (see the two helpers above).
 */
export function getRarityGlowStyle(rarity?: Rarity | string | null): CSSProperties {
  return {
    '--glow-rgb': getRarityGlowRgb(rarity),
    '--glow-core': getRarityGlowCoreRgb(rarity)
  } as CSSProperties
}
