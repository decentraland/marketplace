import { RouteChildrenProps } from 'react-router'

export type Props = {
  onBack: () => void
} & RouteChildrenProps

export type MapDispatchProps = Pick<Props, 'onBack'>
