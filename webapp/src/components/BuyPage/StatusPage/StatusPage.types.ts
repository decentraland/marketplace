import { AssetType } from '../../../modules/asset/types'

export enum Status {
  PROCESSING = 'processing',
  SUCCESS = 'success'
}

export type Props = {
  type: AssetType
  status: Status
}
