import React from 'react'
import { Link } from 'react-router-dom'
import { Blockie, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { shortenAddress } from '../../../modules/wallet/utils'
import { Props } from './Owner.types'
import './Owner.css'

const Owner = (props: Props) => {
  const { nft } = props
  const address = nft.owner
  return (
    <div className="Owner">
      <Link to={locations.account(address, { vendor: nft.vendor })}>
        <label>{t('nft_page.owner')}</label>
        <Popup
          content={shortenAddress(address)}
          position="top center"
          trigger={
            <div className="blockie-wrapper">
              <Blockie seed={address} />
            </div>
          }
        />
      </Link>
    </div>
  )
}

export default React.memo(Owner)
