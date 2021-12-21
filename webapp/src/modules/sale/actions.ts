import { action } from 'typesafe-actions'

export const FETCH_SALES_REQUEST = '[Request] Fetch sales'
export const FETCH_SALES_SUCCESS = '[Success] Fetch sales'
export const FETCH_SALES_FAILURE = '[Failure] Fetch sales'

export const fetchSalesRequest = () => action(FETCH_SALES_REQUEST)
export const fetchSalesSuccess = () => action(FETCH_SALES_SUCCESS)
export const fetchSalesFailure = () => action(FETCH_SALES_FAILURE)

export type FetchSalesRequestAction = ReturnType<typeof fetchSalesRequest>
export type FetchSalesSuccessAction = ReturnType<typeof fetchSalesSuccess>
export type FetchSalesFailureAction = ReturnType<typeof fetchSalesFailure>
