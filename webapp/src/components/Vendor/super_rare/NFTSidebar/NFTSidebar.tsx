import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../../../modules/routing/locations'
import { Vendors } from '../../../../modules/vendor/types'
import { VendorMenu } from '../../../Vendor/VendorMenu'
import { Props } from './NFTSidebar.types'
import './NFTSidebar.css'

const NFTSidebar = (props: Props) => {
  const { section, onMenuItemClick, onNavigate } = props

  const handleGoBack = useCallback(() => {
    onNavigate(locations.partners())
  }, [onNavigate])

  const vendor = Vendors.SUPER_RARE

  return (
    <div className="NFTSidebar">
      <div className="go-back" onClick={handleGoBack}>
        <i className="back icon" />
        {t('nft_sidebar.back')}
      </div>

      <VendorMenu vendor={vendor} section={section} onClick={onMenuItemClick} />
    </div>
  )
}

export default React.memo(NFTSidebar)
