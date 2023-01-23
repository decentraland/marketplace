import { action } from 'typesafe-actions'
import { Asset } from '../asset/types'

// Open Transak
export const OPEN_TRANSAK = 'Open Transak'
export const openTransak = (asset: Asset) => action(OPEN_TRANSAK, { asset })
export type OpenTransakAction = ReturnType<typeof openTransak>
