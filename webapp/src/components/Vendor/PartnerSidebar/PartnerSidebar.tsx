import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../../modules/routing/locations'
import { VendorMenu } from '../../Vendor/VendorMenu'
import { Props } from './PartnerSidebar.types'
import './PartnerSidebar.css'

const PartnerSidebar = (props: Props) => {
  const { vendor, section, onMenuItemClick, onNavigate } = props

  const handleGoBack = useCallback(() => {
    onNavigate(locations.partners())
  }, [onNavigate])

  return (
    <div className="PartnerSidebar">
      <div className="go-back" onClick={handleGoBack}>
        <i className="back icon" />
        {t('nft_sidebar.back')}
      </div>

      <VendorMenu vendor={vendor} section={section} onClick={onMenuItemClick} />
    </div>
  )
}

export default React.memo(PartnerSidebar)
