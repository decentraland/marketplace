import { ProfileProps } from 'decentraland-ui/dist/components/Profile/Profile'
import { BrowseOptions } from '../../modules/routing/types'

export type Props = ProfileProps & {
  className?: string
  browseOptions?: BrowseOptions
}
