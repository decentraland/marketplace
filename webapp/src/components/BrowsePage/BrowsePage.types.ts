import { AssetType } from '../../modules/asset/types'
import { Section } from '../../modules/vendor/decentraland/routing/types'
import { VendorName } from '../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  resultType: AssetType
  section: Section
  isFullscreen?: boolean
}

export type MapStateProps = Pick<
  Props,
  'vendor' | 'isFullscreen' | 'resultType' | 'section'
>
export type MapDispatchProps = {}
export type MapDispatch = {}
