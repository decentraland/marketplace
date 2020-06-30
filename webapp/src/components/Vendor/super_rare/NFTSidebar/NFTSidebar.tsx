import React, { useCallback, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../../../modules/routing/locations'
import { Vendors } from '../../../../modules/vendor/types'
import { Menu } from '../../../Menu'
import { MenuItem } from '../../../Menu/MenuItem'
import { Props } from './NFTSidebar.types'
import './NFTSidebar.css'

const NFTSidebar = (props: Props) => {
  const { section, onMenuItemClick, onNavigate } = props

  const [isOpen, setIsOpen] = useState(true)

  const handleGoBack = useCallback(() => {
    onNavigate(locations.partners())
  }, [onNavigate])

  const handleToggleOpen = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  const vendor = Vendors.SUPER_RARE

  // TODO: The first MenuItem should be extracted to reuse on partners
  return (
    <div className="NFTSidebar">
      <div className="go-back" onClick={handleGoBack}>
        <i className="back icon" />
        {t('nft_sidebar.back')}
      </div>

      <Menu>
        <MenuItem
          className="vendor-menu-item"
          value={vendor}
          currentValue={isOpen ? vendor : undefined}
          image={`/${vendor}.png`}
          onClick={handleToggleOpen}
          withCaret
        />
        {isOpen ? <MenuItem value={section} onClick={onMenuItemClick} /> : null}
      </Menu>
    </div>
  )
}

export default React.memo(NFTSidebar)
