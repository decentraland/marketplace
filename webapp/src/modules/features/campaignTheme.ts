/**
 * The seasonal SKINS a campaign can wear: the page field, its drifting tile and the event tab.
 *
 * A theme is CODE — each one is a block of CSS and an image in the bundle — so neither the flag nor the
 * CMS can invent one. What the flag's variant chooses is which of these to wear, and a name this build
 * cannot paint reads as "no theme", leaving the Marketplace in its ordinary purple.
 *
 * Paired with the `html[data-campaign-theme='…']` blocks at the end of themes/shop-parity.css, and the two
 * have to move together: a name added here with no CSS renders purple and looks like a broken flag, and
 * CSS added without the name can never fire at all.
 */
export const CAMPAIGN_THEMES = ['halloween'] as const

export type CampaignTheme = (typeof CAMPAIGN_THEMES)[number]

/**
 * A theme name as the flag's variant spells it, or `null` for anything this build cannot paint.
 *
 * Case and spacing are forgiven because the value is typed by hand in a dashboard, where `Halloween` is
 * at least as likely as `halloween`.
 *
 * The payload is the ONLY source, deliberately. The Shop falls back to the campaign's own tag when the
 * payload is absent, and that fallback is what makes its behaviour hard to read: a campaign tagged
 * `halloween2026` names no theme this build has, so taking the payload off leaves the skin silently gone
 * with nothing in the dashboard to say why. Here one switch decides and it is the one you are looking at.
 */
export function parseCampaignTheme(value: string | null | undefined): CampaignTheme | null {
  const slug = value?.trim().toLowerCase()
  return CAMPAIGN_THEMES.includes(slug as CampaignTheme) ? (slug as CampaignTheme) : null
}
