import { useEffect } from 'react'
import { CampaignTheme } from '../../modules/features/campaignTheme'

/**
 * Publishes the running season as `data-campaign-theme` on `<html>`.
 *
 * On the root element rather than threaded through props because the skin repaints surfaces that have no
 * reason to know an event exists: the page field, its drifting tile, the campaign tab. Each reaches it
 * with an `html[data-campaign-theme='…']` selector in themes/shop-parity.css.
 */
export function useCampaignThemeAttribute(theme: CampaignTheme | null): void {
  useEffect(() => {
    const root = document.documentElement
    if (theme) {
      root.dataset.campaignTheme = theme
    }
    // Returned unconditionally, so it runs on a theme CHANGE as well as on unmount. That is what takes the
    // skin off the moment an operator flips the flag: without it a reader already on the page keeps the
    // season until they happen to reload, which is the opposite of what a kill switch is for.
    return () => {
      delete root.dataset.campaignTheme
    }
  }, [theme])
}
