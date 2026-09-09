import { getRarityGlowCoreRgb, getRarityGlowRgb, getRarityGlowStyle, getRarityWash } from './rarity'

const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'exotic', 'mythic', 'unique']

// The neutral the module falls back to for anything without a rarity.
const NEUTRAL = '230 230 230'

describe('when building the card wash for a rarity', () => {
  it('should stack the rarity colour from nearly clear at the centre to strongest at the edge', () => {
    // #289cff, epic.
    expect(getRarityWash('epic')).toBe(
      'radial-gradient(circle at 50% 38%, rgba(40, 156, 255, 0.04) 0%, rgba(40, 156, 255, 0.3) 50%, rgba(40, 156, 255, 0.62) 100%)'
    )
  })

  describe('and the rarity is missing or unknown', () => {
    it('should use the neutral colour so a NAME or a parcel is never painted as common', () => {
      expect(getRarityWash()).toContain('rgba(230, 230, 230')
      expect(getRarityWash('not-a-real-rarity')).toContain('rgba(230, 230, 230')
    })
  })
})

describe('when resolving the glow halo for a rarity', () => {
  it('should return the design colour as space-separated channels for the rgb(R G B / a) stops', () => {
    // #a24bf3, legendary. The triple feeds an alpha-less rgb() so it stays unbracketed.
    expect(getRarityGlowRgb('legendary')).toBe('162 75 243')
  })

  describe('and the casing differs', () => {
    it('should still resolve by lowercasing', () => {
      expect(getRarityGlowRgb('EPIC')).toBe('40 156 255')
    })
  })

  describe('and the rarity is one of the greens', () => {
    it('should use the glow override rather than the palette token', () => {
      // Exotic's token lime reads radioactive at page scale and browns as it fades over the purple;
      // rare moves clear of the green that replaces it.
      expect(getRarityGlowRgb('exotic')).toBe('68 199 91')
      expect(getRarityGlowRgb('rare')).toBe('63 211 154')
    })

    it('should leave the card wash on the palette token', () => {
      expect(getRarityWash('exotic')).toContain('rgba(156, 215, 30')
      expect(getRarityWash('rare')).toContain('rgba(52, 206, 118')
    })
  })

  describe('and the rarity is missing or unknown', () => {
    it('should return the neutral colour', () => {
      expect(getRarityGlowRgb()).toBe(NEUTRAL)
      expect(getRarityGlowRgb('not-a-real-rarity')).toBe(NEUTRAL)
    })
  })
})

describe('when resolving the glow core for a rarity', () => {
  it('should keep the hue but push it to the fixed saturation and lightness', () => {
    // Legendary #a24bf3, a violet that sinks into the purple page, comes back as a burning violet.
    expect(getRarityGlowCoreRgb('legendary')).toBe('171 86 251')
    expect(getRarityGlowCoreRgb('mythic')).toBe('251 86 234')
  })

  it('should land every rarity on the same lightness so none out-glows the rest', () => {
    for (const rarity of RARITIES) {
      const channels = getRarityGlowCoreRgb(rarity).split(' ').map(Number)
      const lightness = (Math.max(...channels) + Math.min(...channels)) / 2 / 255
      expect(lightness).toBeCloseTo(0.66, 2)
    }
  })

  describe('and the rarity is one of the greens', () => {
    it('should saturate the glow override, not the palette token', () => {
      expect(getRarityGlowCoreRgb('exotic')).toBe('98 239 123')
      expect(getRarityGlowCoreRgb('rare')).toBe('86 251 187')
    })
  })

  describe('and the colour is achromatic', () => {
    it('should stay grey rather than invent a hue', () => {
      // An unknown rarity resolves to the neutral grey, and a hue angle of 0 on a grey is red, so the
      // saturation push has to be skipped outright.
      expect(getRarityGlowCoreRgb('not-a-real-rarity')).toBe(NEUTRAL)
      expect(getRarityGlowCoreRgb()).toBe(NEUTRAL)
    })
  })
})

describe('when building the glow style for a detail page', () => {
  it('should name the two custom properties the glow class reads', () => {
    // The bridge between this module and rarityGlow.css. A rename on either side would take the glow
    // off all three detail pages silently, since CSS ignores a custom property nobody sets.
    const style = getRarityGlowStyle('epic') as Record<string, string>
    expect(style['--glow-rgb']).toBe(getRarityGlowRgb('epic'))
    expect(style['--glow-core']).toBe(getRarityGlowCoreRgb('epic'))
  })

  describe('and the rarity is missing', () => {
    it('should still set both properties so the class never falls back to its cyan default', () => {
      const style = getRarityGlowStyle() as Record<string, string>
      expect(style['--glow-rgb']).toBe(NEUTRAL)
      expect(style['--glow-core']).toBe(NEUTRAL)
    })
  })
})
