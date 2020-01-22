import React from 'react'
import { Link } from 'react-router-dom'
import { Blockie, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './Owner.types'
import './Owner.css'
import { locations } from '../../../modules/routing/locations'

const Owner = (props: Props) => {
  const address = props.nft.owner.id
  return (
    <div className="Owner">
      <Link to={locations.account(address)}>
        <label>{t('detail.owner')}</label>
        <Popup
          content={address.slice(0, 6) + '...' + address.slice(-4)}
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
