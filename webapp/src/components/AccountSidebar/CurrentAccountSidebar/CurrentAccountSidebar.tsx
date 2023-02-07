import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Sections } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor/types'
import { Menu } from '../../Menu'
import { AssetFilters } from '../../AssetFilters'
import { MenuItem } from '../../Menu/MenuItem'
import { Props } from './CurrentAccountSidebar.types'
import NFTSectionsMenuItems from '../../Vendor/decentraland/NFTSections/NFTSectionsMenuItems'
import { AssetFilter } from '../../AssetFilters/utils'

const decentraland = VendorName.DECENTRALAND

const {
  COLLECTIONS,
  LAND,
  WEARABLES,
  EMOTES,
  ENS,
  ON_SALE,
  ON_RENT,
  SALES,
  BIDS,
  STORE_SETTINGS
} = Sections.decentraland

const CurrentAccountSidebar = ({ section, onBrowse }: Props) => (
  <>
    <Menu>
      <Header sub>{t('account_sidebar.assets')}</Header>
      <MenuItem
        key={COLLECTIONS}
        value={COLLECTIONS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <NFTSectionsMenuItems
        sections={[LAND, WEARABLES, EMOTES, ENS]}
        section={section as Section}
        onSectionClick={section => onBrowse(decentraland, section)}
      />
    </Menu>
    <Menu>
      <Header sub>{t('account_sidebar.store')}</Header>
      <MenuItem
        key={ON_SALE}
        value={ON_SALE}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <MenuItem
        key={ON_RENT}
        value={ON_RENT}
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
        key={BIDS}
        value={BIDS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
      <MenuItem
        key={STORE_SETTINGS}
        value={STORE_SETTINGS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
    </Menu>
    <AssetFilters
      defaultCollapsed={{
        [AssetFilter.Rarity]: true,
        [AssetFilter.Price]: true,
        [AssetFilter.Collection]: true,
        [AssetFilter.PlayMode]: true,
        [AssetFilter.BodyShape]: true,
        [AssetFilter.Network]: true,
        [AssetFilter.OnSale]: false,
        [AssetFilter.More]: false,
      }}
    />
  </>
)

export default React.memo(CurrentAccountSidebar)
