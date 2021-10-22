import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Sections } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor/types'
import { Menu } from '../../Menu'
import { MenuItem } from '../../Menu/MenuItem'
import { Props } from './CurrentAccountSidebar.types'
import NFTSectionsMenuItems from '../../Vendor/decentraland/NFTSections/NFTSectionsMenuItems'

const decentraland = VendorName.DECENTRALAND

const {
  COLLECTIONS,
  LAND,
  WEARABLES,
  ENS,
  ON_SALE,
  SALES,
  SETTINGS
} = Sections.decentraland

const CurrentAccountSidebar = ({ section, onBrowse }: Props) => (
  <div className="CurrentAccountSidebar">
    <Menu>
      <Header sub>{t('account_sidebar.my_assets')}</Header>
      <MenuItem
        key={COLLECTIONS}
        value={COLLECTIONS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <NFTSectionsMenuItems
        sections={[LAND, WEARABLES, ENS]}
        section={section as Section}
        onSectionClick={section => onBrowse(decentraland, section)}
      />
    </Menu>
    <Menu>
      <Header sub>{t('account_sidebar.my_store')}</Header>
      <MenuItem
        key={ON_SALE}
        value={ON_SALE}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <MenuItem
        key={SALES}
        value={SALES}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <MenuItem
        key={SETTINGS}
        value={SETTINGS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
    </Menu>
  </div>
)

export default React.memo(CurrentAccountSidebar)
