import { action } from 'typesafe-actions'
import { Order } from '@dcl/schemas'
import { Asset } from '../asset/types'

// Open Transak
export const OPEN_TRANSAK = 'Open Transak'
export const openTransak = (asset: Asset, order?: Order, useCredits: boolean = false) => action(OPEN_TRANSAK, { asset, order, useCredits })
export type OpenTransakAction = ReturnType<typeof openTransak>

export const OPEN_TRANSAK_FAILURE = 'Open Transak Failure'
export const openTransakFailure = (error: string) => action(OPEN_TRANSAK_FAILURE, { error })
export type OpenTransakFailureAction = ReturnType<typeof openTransakFailure>
