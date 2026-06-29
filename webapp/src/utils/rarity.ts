import { Rarity } from '@dcl/schemas'

// Light reskin palette.
//
// The marketplace historically painted a vivid, per-rarity gradient/color behind
// every wearable and emote (via Rarity.getColor / Rarity.getGradient from
// @dcl/schemas). For the white/grey reskin we replace those with a neutral,
// rarity-agnostic palette so every asset sits on the same soft white-to-grey
// backdrop, matching the rest of the light theme.
//
// The functions keep the `rarity` parameter (even though the neutral palette
// ignores it) so they remain drop-in replacements for the schema helpers and so
// a future "faint tint per rarity" variant can be added here without touching
// call sites.

// Solid background passed to <WearablePreview background={...} />.
const NEUTRAL_BACKGROUND = '#fbfbfc'

// Radial gradient stops [light (center), dark (edge)] — near-white with a barely
// perceptible falloff, so wearables sit on a clean white backdrop (not grey).
const NEUTRAL_GRADIENT: [string, string] = ['#ffffff', '#f3f2f6']

export function getRarityBackgroundColor(_rarity: Rarity = Rarity.COMMON): string {
  return NEUTRAL_BACKGROUND
}

export function getRarityBackgroundGradient(_rarity: Rarity = Rarity.COMMON): [string, string] {
  return NEUTRAL_GRADIENT
}
