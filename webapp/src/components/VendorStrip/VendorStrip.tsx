import React, { useCallback } from 'react'
import { Responsive } from 'decentraland-ui'

import { Vendors, Partner } from '../../modules/vendor/types'
import { Menu } from '../Menu'
import { MenuItem } from '../Menu/MenuItem'
import { Props } from './VendorStrip.types'
import './VendorStrip.css'

const VendorStrip = (props: Props) => {
  const { vendor, address, onBrowse } = props

  const handleClick = useCallback(
    (vendor: Vendors) => {
      onBrowse({ vendor, address })
    },
    [onBrowse, address]
  )

  const decentraland = Vendors.DECENTRALAND

  return (
    <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
      <Menu className="VendorStrip">
        <MenuItem
          key={decentraland}
          value={decentraland}
          currentValue={vendor}
          image={`/${decentraland}.png`}
          onClick={() => handleClick(decentraland)}
        />
        {Object.values(Partner).map(partner => (
          <MenuItem
            key={partner}
            value={partner}
            currentValue={vendor}
            image={`/${partner}.png`}
            onClick={() => handleClick(partner)}
          />
        ))}
      </Menu>
    </Responsive>
  )
}

export default React.memo(VendorStrip)
