import { browse } from '../../../modules/routing/actions'
import { Section } from '../../../modules/vendor/routing/types'

export type Props = {
  vendor?: string
  section?: string
  sections?: Section[]
  onBrowse: ActionFunction<typeof browse>
  search?: string
  withCredits?: boolean
}

export type ContainerProps = Pick<Props, 'section' | 'sections'>
