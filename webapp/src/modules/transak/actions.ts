import { action } from 'typesafe-actions'
import { Order } from '@dcl/schemas'
import { Asset } from '../asset/types'

// Open Transak
export const OPEN_TRANSAK = 'Open Transak'
export const openTransak = (asset: Asset, order?: Order) => action(OPEN_TRANSAK, { asset, order })
export type OpenTransakAction = ReturnType<typeof openTransak>
