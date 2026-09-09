import type { CSSProperties } from 'react'
import { Rarity } from '@dcl/schemas'

/**
 * The shop's rarity palette (decentraland/shop#409), not `@dcl/schemas`'. The two diverge most at the
 * top end: the marketplace's Exotic is a pale `#e4ffb8` against the shop's saturated `#9cd71e`.
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

/**
 * Only reached if one of the hexes above stops parsing, which cannot happen while they are all
 * literals in this file. Kept as a guard, and shared by both entry points so the two dead branches
 * cannot drift into returning different greys for the same situation.
 */
const UNPARSEABLE_RGB: [number, number, number] = [160, 155, 168]

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
 * The wash behind an item on a card: light at the centre so the artwork stays readable, colour
 * gathering at the edges. Unlike `Rarity.getGradient`, which is saturated throughout and turns a grid
 * into blocks of flat colour. Anything without a rarity gets the neutral, never `common`.
 */
export function getRarityWash(rarity?: Rarity | string | null): string {
  const color = toRgb(rarityHex(rarity)) ?? UNPARSEABLE_RGB
  return `radial-gradient(circle at 50% 38%, ${rgba(color, 0.04)} 0%, ${rgba(color, 0.3)} 50%, ${rgba(color, 0.62)} 100%)`
}

// Glow-only overrides; chips, filters and the card wash keep their tokens. The purple field's
// complement sits near hue 100, so exotic's yellow-green token muds as it fades: it moves clear of
// that and drops some core saturation, and rare moves far enough round to stay distinct from it.
const GLOW_OVERRIDES: Record<string, { hex: string; saturation?: number }> = {
  exotic: { hex: '#44c75b', saturation: 0.81 },
  rare: { hex: '#3fd39a' }
}

const DEFAULT_GLOW_SATURATION = 0.95
const DEFAULT_GLOW_LIGHTNESS = 0.66

function glowHex(rarity?: Rarity | string | null): string {
  const key = String(rarity ?? '').toLowerCase()
  return GLOW_OVERRIDES[key]?.hex ?? rarityHex(rarity)
}

// The glow's outer halo, as a bare `R G B` triple for the `rgb(R G B / a)` stops that need the same
// hue at more than one alpha.
export function getRarityGlowRgb(rarity?: Rarity | string | null): string {
  return (toRgb(glowHex(rarity)) ?? UNPARSEABLE_RGB).join(' ')
}

// The glow's hot centre: the same hue at a fixed saturation and lightness, so every item is backlit as
// strongly and only the hue changes. Legendary and epic would otherwise sink into the purple page.
export function getRarityGlowCoreRgb(rarity?: Rarity | string | null, lightness = DEFAULT_GLOW_LIGHTNESS, saturation?: number): string {
  const rgb = toRgb(glowHex(rarity))
  if (!rgb) return UNPARSEABLE_RGB.join(' ')

  const key = String(rarity ?? '').toLowerCase()
  const sat = saturation ?? GLOW_OVERRIDES[key]?.saturation ?? DEFAULT_GLOW_SATURATION
  const [r, g, b] = rgb.map(channel => channel / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  // Achromatic: no hue to saturate, and grey's hue angle of 0 would invent red.
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

/** The custom properties the `rarity-glow` class reads, for a detail page's preview wrapper. */
export function getRarityGlowStyle(rarity?: Rarity | string | null): CSSProperties {
  return {
    '--glow-rgb': getRarityGlowRgb(rarity),
    '--glow-core': getRarityGlowCoreRgb(rarity)
  } as CSSProperties
}
