import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { locations } from '../../modules/routing/locations'
import { AssetType } from '../../modules/asset/types'
import { VendorName } from '../../modules/vendor'
import { Section } from '../../modules/vendor/decentraland'
import { Props } from './LinkedProfile.types'

export const LinkedProfile = (props: Props) => {
  const { address, className } = props

  return (
    <Link
      className={className}
      to={locations.account(address, {
        assetType: AssetType.NFT,
        vendor: VendorName.DECENTRALAND,
        section: Section.ALL
      })}
    >
      <Profile {...props} />
    </Link>
  )
}
