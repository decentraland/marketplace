import React, { useCallback } from 'react'
import { VendorName } from '../../modules/vendor/types'
import { Props } from './AccountSidebar.types'
import CurrentAccountSidebar from './CurrentAccountSidebar'
import OtherAccountSidebar from './OtherAccountSidebar'

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
        <OtherAccountSidebar section={section} onBrowse={handleOnBrowse} />
      )}
    </div>
  )
}

export default React.memo(AccountSidebar)
