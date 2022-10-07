import { Dispatch } from 'redux'
import { AssetType } from '../../modules/asset/types'
import {
  fetchEventRequest,
  FetchEventRequestAction
} from '../../modules/event/actions'
import { Section } from '../../modules/vendor/routing/types'
import { VendorName } from '../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  assetType: AssetType
  section: Section
  isFullscreen?: boolean
  onFetchEventContracts: typeof fetchEventRequest
  contracts: Record<string, string[]>
}

export type MapStateProps = Pick<
  Props,
  'vendor' | 'isFullscreen' | 'assetType' | 'section' | 'contracts'
>
export type MapDispatchProps = Pick<Props, 'onFetchEventContracts'>
export type MapDispatch = Dispatch<FetchEventRequestAction>
