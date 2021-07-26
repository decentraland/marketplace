import { ResultType } from '../../modules/routing/types'
import { VendorName } from '../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  resultType: ResultType
  isFullscreen?: boolean
}

export type MapStateProps = Pick<
  Props,
  'vendor' | 'isFullscreen' | 'resultType'
>
export type MapDispatchProps = {}
export type MapDispatch = {}
