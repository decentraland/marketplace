import { action } from 'typesafe-actions'
import { ActivityEvent } from './types'

export const FETCH_USER_ACTIVITY_REQUEST = '[Request] Fetch user activity'
export const FETCH_USER_ACTIVITY_SUCCESS = '[Success] Fetch user activity'
export const FETCH_USER_ACTIVITY_FAILURE = '[Failure] Fetch user activity'

export const fetchUserActivityRequest = () => action(FETCH_USER_ACTIVITY_REQUEST, {})
export const fetchUserActivitySuccess = (events: ActivityEvent[], total: number) => action(FETCH_USER_ACTIVITY_SUCCESS, { events, total })
export const fetchUserActivityFailure = (error: string) => action(FETCH_USER_ACTIVITY_FAILURE, { error })

export type FetchUserActivityRequestAction = ReturnType<typeof fetchUserActivityRequest>
export type FetchUserActivitySuccessAction = ReturnType<typeof fetchUserActivitySuccess>
export type FetchUserActivityFailureAction = ReturnType<typeof fetchUserActivityFailure>
