import React, { useCallback } from 'react'
import { AssetType } from '../../modules/asset/types'
import { VendorName } from '../../modules/vendor/types'
import { Props } from './AccountSidebar.types'
import CurrentAccountSidebar from './CurrentAccountSidebar'
import OtherAccountSidebar from './OtherAccountSidebar'
import './AccountSidebar.css'

const AccountSidebar = ({
  address,
  section,
  isCurrentAccount,
  onBrowse
}: Props) => {
  const handleOnBrowse = useCallback(
    (vendor: VendorName, section: string, assetType?: AssetType) => {
      onBrowse({ vendor, section, address, assetType })
    },
    [address, onBrowse]
  )

  return (
    <div className="AccountSidebar">
      {isCurrentAccount ? (
        <CurrentAccountSidebar section={section} onBrowse={handleOnBrowse} />
      ) : (
        <OtherAccountSidebar section={section} />
      )}
    </div>
  )
}

export default React.memo(AccountSidebar)
