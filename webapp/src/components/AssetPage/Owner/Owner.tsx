import React from 'react'
import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { NFTBrowseOptions, Section } from '../../../modules/routing/types'
import { VendorName } from '../../../modules/vendor'
import { Props } from './Owner.types'
import './Owner.css'
import { ResultType } from '../../../modules/asset/types'

const Owner = (props: Props) => {
  const { asset } = props

  let label: string
  let address: string
  let browseOptions: NFTBrowseOptions = {}

  if ('owner' in asset) {
    label = t('asset_page.owner')
    address = asset.owner
    browseOptions = {
      resultType: ResultType.ITEM,
      vendor: asset.vendor,
      section: Section[asset.vendor].ALL
    }
  } else {
    label = t('asset_page.creator')
    address = asset.creator
    browseOptions = {
      resultType: ResultType.ITEM,
      section: Section[VendorName.DECENTRALAND].WEARABLES
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
