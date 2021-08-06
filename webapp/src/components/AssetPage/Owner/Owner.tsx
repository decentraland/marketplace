import React from 'react'
import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { BrowseOptions } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'
import { AssetType } from '../../../modules/asset/types'
import { Props } from './Owner.types'
import './Owner.css'

const Owner = (props: Props) => {
  const { asset } = props

  let label: string
  let address: string
  let browseOptions: BrowseOptions = {}

  if ('owner' in asset) {
    label = t('asset_page.owner')
    address = asset.owner
    browseOptions = {
      assetType: AssetType.ITEM,
      vendor: asset.vendor,
      section: Section.ALL
    }
  } else {
    label = t('asset_page.creator')
    address = asset.creator
    browseOptions = {
      assetType: AssetType.ITEM,
      section: Section.WEARABLES
    }
  }

  return (
    <div className="Owner">
      <Link to={locations.account(address, browseOptions)}>
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
