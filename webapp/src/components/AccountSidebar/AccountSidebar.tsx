import React, { useCallback } from 'react'

import { Vendors, Partner } from '../../modules/vendor/types'
import { Section } from '../../modules/routing/types'
import { VendorMenu } from '../Vendor/VendorMenu'
import { Props } from './AccountSidebar.types'

const AccountSidebar = (props: Props) => {
  const { address, section, onBrowse } = props

  const handleOnBrowse = useCallback(
    (vendor: Vendors, section: Section) => {
      onBrowse({ vendor, section, address })
    },
    [address, onBrowse]
  )

  const decentraland = Vendors.DECENTRALAND

  return (
    <div className="NFTSidebar">
      <VendorMenu
        key={decentraland}
        address={address}
        vendor={decentraland}
        section={section}
        onClick={section => handleOnBrowse(decentraland, section)}
      />
      {Object.values(Partner).map(partner => (
        <VendorMenu
          key={partner}
          address={address}
          vendor={partner}
          section={section}
          onClick={section => handleOnBrowse(partner, section)}
        />
      ))}
    </div>
  )
}

export default React.memo(AccountSidebar)
