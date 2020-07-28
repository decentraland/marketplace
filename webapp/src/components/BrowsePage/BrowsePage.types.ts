import { Vendors } from '../../modules/vendor/types'

export type Props = {
  vendor: Vendors
}

export type MapStateProps = Pick<Props, 'vendor'>
export type MapDispatchProps = {}
export type MapDispatch = {}
