import React, { useCallback } from 'react'
import { VendorName } from '../../modules/vendor/types'
import { getPartners } from '../../modules/vendor/utils'
import { VendorMenu } from '../Vendor/VendorMenu'
import { Props } from './AccountSidebar.types'
import CurrentAccountSidebar from './CurrentAccountSidebar'

const decentraland = VendorName.DECENTRALAND

const AccountSidebar = ({
  address,
  section,
  isCurrentAccount,
  onBrowse
}: Props) => {
  const handleOnBrowse = useCallback(
    (vendor: VendorName, section: string) => {
      onBrowse({ vendor, section, address })
    },
    [address, onBrowse]
  )

  return (
    <div className="NFTSidebar">
      {isCurrentAccount ? (
        <CurrentAccountSidebar section={section} onBrowse={handleOnBrowse} />
      ) : (
        <>
          <VendorMenu
            key={decentraland}
            address={address}
            vendor={decentraland}
            section={section}
            onClick={section => handleOnBrowse(decentraland, section)}
          />
          {getPartners().map(partner => (
            <VendorMenu
              key={partner}
              address={address}
              vendor={partner}
              section={section}
              onClick={section => handleOnBrowse(partner, section)}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default React.memo(AccountSidebar)
