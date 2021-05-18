import { VendorName } from '../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  isFullscreen?: boolean
}

export type MapStateProps = Pick<Props, 'vendor' | 'isFullscreen'>
export type MapDispatchProps = {}
export type MapDispatch = {}
