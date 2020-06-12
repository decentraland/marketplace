import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'

import { Menu } from '../Menu'
import { MenuItem } from '../Menu/MenuItem'
import { Props } from './PartnersMenu.types'
import { Vendors } from '../../modules/vendor'

const PartnersMenu = (props: Props) => {
  const { onMenuItemClick } = props

  return (
    <div className="PartnersMenu">
      <Header sub>{t('categories_menu.categories')}</Header>
      <Menu>
        {Object.values(Vendors)
          .filter(vendor => vendor !== Vendors.DECENTRALAND)
          .map(vendor => (
            <MenuItem
              key={vendor}
              value={vendor}
              image={`${vendor}.png`}
              onClick={onMenuItemClick}
            />
          ))}
      </Menu>
    </div>
  )
}

export default React.memo(PartnersMenu)
