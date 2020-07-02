import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../../../modules/routing/locations'
import { Section } from '../../../../modules/routing/search'
import { Vendors } from '../../../../modules/vendor/types'
import { Menu } from '../../../Menu'
import { VendorMenuItem } from '../../../Vendor/VendorMenuItem'
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

      <Menu>
        <VendorMenuItem
          vendor={vendor}
          section={section}
          sections={[Section.ALL]}
          onClick={onMenuItemClick}
        />
      </Menu>
    </div>
  )
}

export default React.memo(NFTSidebar)
