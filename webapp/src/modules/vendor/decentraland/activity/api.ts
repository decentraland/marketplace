import signedFetch, { AuthIdentity } from 'decentraland-crypto-fetch'
import { ActivityEvent } from '../../../activity/types'
import { MARKETPLACE_SERVER_URL } from '../nft'

type ActivityResponse = {
  ok: boolean
  message?: string
  data: { data: ActivityEvent[]; total: number }
}

class ActivityAPI {
  fetchUserActivity = async (identity: AuthIdentity): Promise<{ data: ActivityEvent[]; total: number }> => {
    const url = `${MARKETPLACE_SERVER_URL}/activity`
    const response = await signedFetch(url, {
      method: 'GET',
      identity,
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      throw new Error('Could not fetch activity')
    }

    const json = (await response.json()) as ActivityResponse
    if (json.ok) {
      return json.data
    }
    throw new Error(json.message ?? 'Could not fetch activity')
  }
}

export const activityAPI = new ActivityAPI()
