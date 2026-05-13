import signedFetch, { AuthIdentity } from 'decentraland-crypto-fetch'
import { API_SIGNER } from '../../../../lib/api'
import { ActivityEvent } from '../../../activity/types'
import { MARKETPLACE_SERVER_URL } from '../nft'

// Success body matches the sales/orders/bids shape: { data, total } (no `ok` envelope).
// Errors still carry { ok: false, message } — that's the server's convention.
type ActivitySuccessBody = { data: ActivityEvent[]; total: number }
type ActivityErrorBody = { ok: false; message?: string }
type ActivityResponseBody = ActivitySuccessBody | ActivityErrorBody

const isErrorBody = (b: ActivityResponseBody): b is ActivityErrorBody => 'ok' in b && b.ok === false

class ActivityAPI {
  fetchUserActivity = async (
    identity: AuthIdentity,
    options: { limit: number; offset: number } = { limit: 20, offset: 0 }
  ): Promise<ActivitySuccessBody> => {
    const params = new URLSearchParams({
      limit: String(options.limit),
      offset: String(options.offset)
    })
    const url = `${MARKETPLACE_SERVER_URL}/activity?${params.toString()}`
    const response = await signedFetch(url, {
      method: 'GET',
      identity,
      metadata: { signer: API_SIGNER },
      headers: { 'Content-Type': 'application/json' }
    })

    const json = (await response.json().catch(() => null)) as ActivityResponseBody | null

    if (!response.ok) {
      throw new Error(json && isErrorBody(json) && json.message ? json.message : 'Could not fetch activity')
    }
    if (!json || isErrorBody(json)) {
      throw new Error(json && isErrorBody(json) && json.message ? json.message : 'Could not fetch activity')
    }
    return json
  }
}

export const activityAPI = new ActivityAPI()
