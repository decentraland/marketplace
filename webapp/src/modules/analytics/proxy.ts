import { AnalyticsSnippetOptions } from 'decentraland-dapps/dist/modules/analytics/snippet'

/**
 * Last known value of the `dapps-seg-alt` flag, kept here because the analytics middleware is created
 * while the store is built and the flag only arrives later, through the features saga. So the boot
 * decides with what the previous session learned, and flipping the flag takes effect on the next load.
 */
export const SEGMENT_KILL_SWITCH_KEY = 'dcl-analytics-seg-alt'

/**
 * Options that send analytics.js and its events through our first party proxy, unless the kill switch
 * says otherwise. Ad blockers drop Segment's own hosts, which is why the proxy exists.
 *
 * Undefined means "no options", which is what leaves the SDK on Segment's CDN and ingestion. A value
 * that was never persisted counts as off: a flag service that is down or unreachable must not be able
 * to change where analytics goes.
 */
export function getAnalyticsProxyOptions(analyticsUrl: string, apiHost: string): AnalyticsSnippetOptions | undefined {
  if (isSegmentKillSwitchOn()) {
    return undefined
  }

  const options = {
    ...(analyticsUrl ? { analyticsUrl } : undefined),
    ...(apiHost ? { apiHost } : undefined)
  }

  return Object.keys(options).length > 0 ? options : undefined
}

/** Records the flag so the next boot can read it synchronously, before anything can fetch it. */
export function persistSegmentKillSwitch(isEnabled: boolean): void {
  try {
    localStorage.setItem(SEGMENT_KILL_SWITCH_KEY, isEnabled ? '1' : '0')
  } catch (error) {
    // Storage can be unavailable (private mode, quota). The proxy stays as configured, which is the
    // safe end: events keep flowing, they just keep taking the route this build was deployed with.
  }
}

function isSegmentKillSwitchOn(): boolean {
  try {
    return localStorage.getItem(SEGMENT_KILL_SWITCH_KEY) === '1'
  } catch (error) {
    return false
  }
}
