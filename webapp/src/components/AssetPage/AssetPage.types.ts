import { getLocation } from 'connected-react-router'
import { AssetType } from '../../modules/asset/types'

export type Props = {
  type: AssetType
  onBack: (location?: string) => void
  location: ReturnType<typeof getLocation>
}

export type MapStateProps = Pick<Props, 'location'>

export type MapDispatchProps = Pick<Props, 'onBack'>
