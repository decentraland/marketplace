import { Sale, SaleFilters } from '@dcl/schemas'
import { action } from 'typesafe-actions'

export const FETCH_SALES_REQUEST = '[Request] Fetch sales'
export const FETCH_SALES_SUCCESS = '[Success] Fetch sales'
export const FETCH_SALES_FAILURE = '[Failure] Fetch sales'

export const fetchSalesRequest = (filters: SaleFilters) => action(FETCH_SALES_REQUEST, { filters })
export const fetchSalesSuccess = (sales: Sale[], count: number) => action(FETCH_SALES_SUCCESS, { sales, count })
export const fetchSalesFailure = (error: string) => action(FETCH_SALES_FAILURE, { error })

export type FetchSalesRequestAction = ReturnType<typeof fetchSalesRequest>
export type FetchSalesSuccessAction = ReturnType<typeof fetchSalesSuccess>
export type FetchSalesFailureAction = ReturnType<typeof fetchSalesFailure>
