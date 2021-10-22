import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Sections } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor/types'
import { Menu } from '../../Menu'
import { MenuItem } from '../../Menu/MenuItem'
import { NFTSectionsMenuItems } from '../../Vendor/decentraland/NFTSections/NFTSections'
import { Props } from './CurrentAccountSidebar.types'

const decentraland = VendorName.DECENTRALAND

const CurrentAccountSidebar = ({ section, onBrowse }: Props) => (
  <div className="CurrentAccountSidebar">
    <Menu>
      <Header sub>{t('account_sidebar.my_assets')}</Header>
      <MenuItem
        key={Sections.decentraland.COLLECTIONS}
        value={Sections.decentraland.COLLECTIONS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <NFTSectionsMenuItems
        sections={[
          Sections.decentraland.LAND,
          Sections.decentraland.WEARABLES,
          Sections.decentraland.ENS
        ]}
        section={section as Section}
        onSectionClick={section => onBrowse(decentraland, section)}
      />
    </Menu>
    <Menu>
      <Header sub>{t('account_sidebar.my_store')}</Header>
      <MenuItem
        key={Sections.decentraland.ON_SALE}
        value={Sections.decentraland.ON_SALE}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <MenuItem
        key={Sections.decentraland.SALES}
        value={Sections.decentraland.SALES}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <MenuItem
        key={Sections.decentraland.SETTINGS}
        value={Sections.decentraland.SETTINGS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
    </Menu>
  </div>
)

export default React.memo(CurrentAccountSidebar)
