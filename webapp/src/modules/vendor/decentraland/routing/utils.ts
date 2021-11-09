import { Section } from './types'

const nftSections = new Set([
  Section.ALL,
  Section.LAND,
  Section.PARCELS,
  Section.ESTATES,
  Section.ENS,
  Section.WEARABLES,
  Section.WEARABLES_HEAD,
  Section.WEARABLES_EYEBROWS,
  Section.WEARABLES_EYES,
  Section.WEARABLES_FACIAL_HAIR,
  Section.WEARABLES_HAIR,
  Section.WEARABLES_MOUTH,
  Section.WEARABLES_UPPER_BODY,
  Section.WEARABLES_LOWER_BODY,
  Section.WEARABLES_FEET,
  Section.WEARABLES_ACCESORIES,
  Section.WEARABLES_EARRING,
  Section.WEARABLES_EYEWEAR,
  Section.WEARABLES_HAT,
  Section.WEARABLES_HELMET,
  Section.WEARABLES_MASK,
  Section.WEARABLES_TIARA,
  Section.WEARABLES_TOP_HEAD
])

export const isNFTSection = (section: Section) => nftSections.has(section)
