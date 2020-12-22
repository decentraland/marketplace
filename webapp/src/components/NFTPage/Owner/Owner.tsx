import React from 'react'
import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { Props } from './Owner.types'
import './Owner.css'

const Owner = (props: Props) => {
  const { nft } = props
  const address = nft.owner
  return (
    <div className="Owner">
      <Link to={locations.account(address, { vendor: nft.vendor })}>
        <label>{t('nft_page.owner')}</label>
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
