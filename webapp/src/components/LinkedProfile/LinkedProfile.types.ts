import { ProfileProps } from 'decentraland-ui/dist/components/Profile/Profile'
import { BrowseOptions } from '../../modules/routing/types'

export type Props = ProfileProps<React.ElementType> & {
  className?: string
  browseOptions?: BrowseOptions
  isProfileEnabled?: boolean
}

export type RedirectionProps = {
  as: React.ElementType
  to?: string
  href?: string
}

export type MapStateProps = Pick<Props, 'isProfileEnabled'>
