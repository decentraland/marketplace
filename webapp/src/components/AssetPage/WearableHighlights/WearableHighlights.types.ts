import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NFT } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'

export type Props = {
  type: AssetType
  wearable: NFT['data']['wearable']
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
