import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Profile } from 'decentraland-dapps/dist/containers'
import { locations } from '../../modules/routing/locations'
import { Props } from './LinkedProfile.types'
import styles from './LinkedProfile.module.css'

export const LinkedProfile = (props: Props) => {
  const { address, className, browseOptions } = props

  return (
    <Link
      className={classNames(styles.LinkedProfile, className)}
      to={locations.account(address, browseOptions)}
    >
      <Profile {...props} />
    </Link>
  )
}
