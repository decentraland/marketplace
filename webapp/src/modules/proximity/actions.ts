import { action } from 'typesafe-actions'
import { Proximity } from './types'

export const FETCH_PROXIMITY_REQUEST = '[Request] Fetch Proximity'
export const FETCH_PROXIMITY_SUCCESS = '[Success] Fetch Proximity'
export const FETCH_PROXIMITY_FAILURE = '[Failure] Fetch Proximity'

export const fetchProximityRequest = () => action(FETCH_PROXIMITY_REQUEST)
export const fetchProximitySuccess = (proximity: Record<string, Proximity>) =>
  action(FETCH_PROXIMITY_SUCCESS, { proximity })
export const fetchProximityFailure = (error: string) =>
  action(FETCH_PROXIMITY_FAILURE, { error })

export type FetchProximityRequestAction = ReturnType<
  typeof fetchProximityRequest
>
export type FetchProximitySuccessAction = ReturnType<
  typeof fetchProximitySuccess
>
export type FetchProximityFailureAction = ReturnType<
  typeof fetchProximityFailure
>
