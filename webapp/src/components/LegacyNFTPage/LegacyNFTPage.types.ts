import { RouteComponentProps } from 'react-router'

type Params = {
  estateId?: string
  x?: string
  y?: string
}

export type Props = RouteComponentProps<Params>
