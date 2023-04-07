import { RouteComponentProps } from 'react-router'

export type Props = RouteComponentProps & {
  inMaintenance: boolean
  isFavoritesEnabled: boolean
}

export type MapStateProps = Pick<Props, 'inMaintenance' | 'isFavoritesEnabled'>

export type State = {
  hasError: boolean
  stackTrace: string
}
