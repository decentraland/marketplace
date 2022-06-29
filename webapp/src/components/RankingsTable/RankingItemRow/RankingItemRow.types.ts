import { ItemRank } from '../../../modules/analytics/types'

export type Props = {
  entity: ItemRank
  isLoading: boolean
}

export type MapStateProps = Pick<Props, 'entity' | 'isLoading'>
