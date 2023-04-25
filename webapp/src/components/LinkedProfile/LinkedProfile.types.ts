import { ProfileProps } from 'decentraland-ui/dist/components/Profile/Profile'
import { BrowseOptions } from '../../modules/routing/types'

export type Props<T extends React.ElementType> = ProfileProps<T> & {
  className?: string
  browseOptions?: BrowseOptions
}
