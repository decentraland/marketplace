import { action } from 'typesafe-actions'

export const FETCH_EVENT_REQUEST = '[Request] Fetch event'
export const FETCH_EVENT_SUCCESS = '[Success] Fetch event'
export const FETCH_EVENT_FAILURE = '[Failure] Fetch event'

export const fetchEventRequest = (tags: string[]) =>
  action(FETCH_EVENT_REQUEST, { tags })
export const fetchEventSuccess = (tags: string[], contracts: string[]) =>
  action(FETCH_EVENT_SUCCESS, { tags, contracts })
export const fetchEventFailure = (error: string) =>
  action(FETCH_EVENT_FAILURE, { error })

export type FetchEventRequestAction = ReturnType<typeof fetchEventRequest>
export type FetchEventSuccessAction = ReturnType<typeof fetchEventSuccess>
export type FetchEventFailureAction = ReturnType<typeof fetchEventFailure>
