import React, { useCallback } from 'react'

import { VendorName } from '../../modules/vendor/types'
import { VendorMenu } from '../Vendor/VendorMenu'
import { Props } from './AccountSidebar.types'

const AccountSidebar = (props: Props) => {
  const { address, section, onBrowse } = props

  const handleOnBrowse = useCallback(
    (vendor: VendorName, section: string) => {
      onBrowse({ vendor, section, address })
    },
    [address, onBrowse]
  )

  const decentraland = VendorName.DECENTRALAND

  return (
    <div className="NFTSidebar">
      <VendorMenu
        key={decentraland}
        address={address}
        vendor={decentraland}
        section={section}
        onClick={section => handleOnBrowse(decentraland, section)}
      />
    </div>
  )
}

export default React.memo(AccountSidebar)
