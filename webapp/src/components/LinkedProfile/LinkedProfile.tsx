import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { profileUrl } from '../../lib/environment'
import { locations } from '../../modules/routing/locations'
import { Props, RedirectionProps } from './LinkedProfile.types'

export const LinkedProfile = ({ isProfileEnabled, ...props }: Props) => {
  const { address, browseOptions } = props
  const redirectionProps: RedirectionProps = isProfileEnabled
    ? {
        as: 'a',
        href: `${profileUrl}/accounts/${address}`
      }
    : {
        as: Link,
        to: locations.account(address, browseOptions)
      }

  return <Profile {...props} {...redirectionProps} />
}
