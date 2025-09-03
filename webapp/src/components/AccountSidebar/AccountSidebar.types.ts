import { browse } from '../../modules/routing/actions'
import { Section } from '../../modules/vendor/decentraland'

export type Props = {
  section: Section
  address: string
  isCurrentAccount?: boolean
  onBrowse: ActionFunction<typeof browse>
}

export type ContainerProps = Pick<Props, 'address' | 'isCurrentAccount'>
