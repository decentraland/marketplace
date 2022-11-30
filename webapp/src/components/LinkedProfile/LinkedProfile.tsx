import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { locations } from '../../modules/routing/locations'
import { Props } from './LinkedProfile.types'

export const LinkedProfile = (props: Props) => {
  const { address, className, browseOptions } = props

  return (
    <Link className={className} to={locations.account(address, browseOptions)}>
      <Profile {...props} />
    </Link>
  )
}
