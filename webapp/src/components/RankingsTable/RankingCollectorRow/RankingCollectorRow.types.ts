import { CollectorRank } from '../../../modules/analytics/types'

export type Props = {
  entity: CollectorRank
  isLoading: boolean
}

export type MapStateProps = Pick<Props, 'entity' | 'isLoading'>
