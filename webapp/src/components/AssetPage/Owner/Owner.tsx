import React from 'react'
import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { VendorName } from '../../../modules/vendor'
import { Props } from './Owner.types'
import './Owner.css'

const Owner = (props: Props) => {
  const { asset } = props

  let label: string
  let address: string
  let vendor: VendorName

  if ('owner' in asset) {
    label = t('asset_page.owner')
    address = asset.owner
    vendor = asset.vendor
  } else {
    label = t('asset_page.creator')
    address = asset.creator
    vendor = VendorName.DECENTRALAND
  }

  return (
    <div className="Owner">
      <Link to={locations.account(address, { vendor: vendor })}>
        <label>{label}</label>
        <div className="blockie-wrapper">
          <Profile
            size="large"
            address={address}
            imageOnly
            hasPopup
            inline={false}
          />
        </div>
      </Link>
    </div>
  )
}

export default React.memo(Owner)
