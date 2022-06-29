import { CreatorRank } from '../../../modules/analytics/types'

export type Props = {
  entity: CreatorRank
  isLoading: boolean
}

export type MapStateProps = Pick<Props, 'entity' | 'isLoading'>
