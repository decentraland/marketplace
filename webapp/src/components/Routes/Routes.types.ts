import { RouteComponentProps } from 'react-router'

export type Props = RouteComponentProps & {
  inMaintenance: boolean
  isBuyNftsWithFiatEnabled: boolean
}

export type MapStateProps = Pick<
  Props,
  'inMaintenance' | 'isBuyNftsWithFiatEnabled'
>

export type State = {
  hasError: boolean
  stackTrace: string
}
