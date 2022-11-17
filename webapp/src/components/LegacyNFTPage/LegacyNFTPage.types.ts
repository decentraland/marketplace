import { RouteComponentProps } from 'react-router'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'

type Params = {
  estateId?: string
  x?: string
  y?: string
}

export type Props = {
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
} & RouteComponentProps<Params>

export type MapStateProps = Pick<Props, 'match' | 'history' | 'getContract'>
export type OwnProps = RouteComponentProps<Params>
