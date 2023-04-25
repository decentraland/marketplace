import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { locations } from '../../modules/routing/locations'
import { Props } from './LinkedProfile.types'

export const LinkedProfile = <T extends React.ElementType>(props: Props<T>) => {
  const { address, className, browseOptions } = props

  return (
    <Profile
      {...props}
      className={className}
      as={Link}
      to={locations.account(address, browseOptions)}
    />
  )
}
