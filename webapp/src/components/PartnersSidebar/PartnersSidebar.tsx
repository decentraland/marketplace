import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Partner } from '../../modules/vendor/types'
import { Menu } from '../Menu'
import { MenuItem } from '../Menu/MenuItem'
import { Props } from './PartnersSidebar.types'
import './PartnersSidebar.css'

const PartnersSidebar = (props: Props) => {
  const { onMenuItemClick } = props

  return (
    <div className="PartnersSidebar">
      <Header sub>{t('partners_page.partners')}</Header>
      <Menu>
        {Object.values(Partner).map(vendor => (
          <MenuItem
            key={vendor}
            value={vendor}
            image={`/${vendor}.png`}
            onClick={onMenuItemClick}
          />
        ))}
      </Menu>
    </div>
  )
}

export default React.memo(PartnersSidebar)
