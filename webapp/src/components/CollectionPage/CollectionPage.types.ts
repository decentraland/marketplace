import { RouteChildrenProps } from 'react-router'

export type Props = {
  onBack: () => void
  currentAddress?: string
} & RouteChildrenProps

export type MapStateProps = Pick<Props, 'currentAddress'>
export type MapDispatchProps = Pick<Props, 'onBack'>
