import { Profile } from 'decentraland-dapps/dist/containers'
import { profileUrl } from '../../lib/environment'
import { Props } from './LinkedProfile.types'

export const LinkedProfile = ({ isProfileEnabled, ...props }: Props) => {
  const { address } = props
  return <Profile {...props} as="a" href={`${profileUrl}/accounts/${address}`} />
}
