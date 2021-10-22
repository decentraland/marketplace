import React, { useCallback } from 'react'

import { VendorName } from '../../modules/vendor/types'
import { getPartners } from '../../modules/vendor/utils'
import { NFTSections } from '../Vendor/NFTSections'
import { VendorMenu } from '../Vendor/VendorMenu'
import { Props } from './AccountSidebar.types'

const AccountSidebar = (props: Props) => {
  const { address, section, isCurrentAddress, onBrowse } = props

  const handleOnBrowse = useCallback(
    (vendor: VendorName, section: string) => {
      onBrowse({ vendor, section, address })
    },
    [address, onBrowse]
  )

  const decentraland = VendorName.DECENTRALAND

  return (
    <div className="NFTSidebar">
      {isCurrentAddress ? (
        <div className="foo">
          <NFTSections
            vendor={VendorName.DECENTRALAND}
            address={address}
            section={section}
            onSectionClick={section => handleOnBrowse(decentraland, section)}
          />
        </div>
      ) : (
        <VendorMenu
          key={decentraland}
          address={address}
          vendor={decentraland}
          section={section}
          onClick={section => handleOnBrowse(decentraland, section)}
        />
      )}
      {!isCurrentAddress &&
        getPartners().map(partner => (
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
