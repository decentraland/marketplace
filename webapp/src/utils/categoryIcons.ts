import accessories from '../images/categories/cat-accessories.svg'
import earring from '../images/categories/cat-earring.svg'
import eyebrows from '../images/categories/cat-eyebrows.svg'
import eyes from '../images/categories/cat-eyes.svg'
import eyewear from '../images/categories/cat-eyewear.svg'
import facialHair from '../images/categories/cat-facial-hair.svg'
import feet from '../images/categories/cat-feet.svg'
import hair from '../images/categories/cat-hair.svg'
import handwear from '../images/categories/cat-handwear.svg'
import hat from '../images/categories/cat-hat.svg'
import head from '../images/categories/cat-head.svg'
import helmet from '../images/categories/cat-helmet.svg'
import lower from '../images/categories/cat-lower.svg'
import mask from '../images/categories/cat-mask.svg'
import mouth from '../images/categories/cat-mouth.svg'
import skins from '../images/categories/cat-skins.svg'
import tiara from '../images/categories/cat-tiara.svg'
import topHead from '../images/categories/cat-top-head.svg'
import upper from '../images/categories/cat-upper.svg'
import emoteDance from '../images/categories/emote-dance.svg'
import emoteFun from '../images/categories/emote-fun.svg'
import emoteGreetings from '../images/categories/emote-greetings.svg'
import emoteHorror from '../images/categories/emote-horror.svg'
import emoteMisc from '../images/categories/emote-misc.svg'
import emotePoses from '../images/categories/emote-poses.svg'
import emoteReactions from '../images/categories/emote-reactions.svg'
import emoteStunt from '../images/categories/emote-stunt.svg'

/**
 * Category glyph for a sidebar section, keyed by the section's routing value.
 *
 * The artwork is the shop's own (`assets/icons/cat-*.svg`, `emote-*.svg`), copied rather than
 * re-drawn so both sidebars carry the same marks. Sections with no entry render without a glyph,
 * which is deliberate: LAND, ENS and the group headers have none in the shop either.
 */
const SECTION_ICONS: Record<string, string> = {
  wearables_head: head,
  wearables_eyebrows: eyebrows,
  wearables_eyes: eyes,
  wearables_facial_hair: facialHair,
  wearables_hair: hair,
  wearables_mouth: mouth,
  wearables_hat: hat,
  wearables_helmet: helmet,
  wearables_mask: mask,
  wearables_tiara: tiara,
  wearables_top_head: topHead,
  wearables_upper_body: upper,
  wearables_lower_body: lower,
  wearables_feet: feet,
  wearables_hands: handwear,
  wearables_accessories: accessories,
  wearables_earring: earring,
  wearables_eyewear: eyewear,
  wearables_skin: skins,
  emotes_dance: emoteDance,
  emotes_stunt: emoteStunt,
  emotes_greetings: emoteGreetings,
  emotes_fun: emoteFun,
  emotes_poses: emotePoses,
  emotes_reactions: emoteReactions,
  emotes_horror: emoteHorror,
  emotes_miscellaneous: emoteMisc
}

export function getCategoryIcon(section: string | number | undefined): string | undefined {
  return section === undefined ? undefined : SECTION_ICONS[String(section)]
}
