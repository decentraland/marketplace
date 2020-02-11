import React from 'react'
import { Link } from 'react-router-dom'
import { Blockie, Popup } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { shortenAddress } from '../../modules/wallet/utils'
import { Props } from './Address.types'
import './Address.css'

const Address = (props: Props) => {
  const { address } = props

  return (
    <span className="Address" title={address}>
      <Popup
        content={address}
        position="top center"
        trigger={
          <Link to={locations.account(address)}>
            <Blockie seed={address} scale={3} />
            &nbsp;
            <span className="short-address">{shortenAddress(address)}</span>
          </Link>
        }
      />
    </span>
  )
}

export default React.memo(Address)
