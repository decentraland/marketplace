import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'
import { usePagination } from '../../../lib/pagination'
import { BrowseOptions, Sections } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor/types'
import { AssetFilters } from '../../AssetFilters'
import { AssetFilter } from '../../AssetFilters/utils'
import { Menu } from '../../Menu'
import { MenuItem } from '../../Menu/MenuItem'
import NFTSectionsMenuItems from '../../Vendor/decentraland/NFTSections/NFTSectionsMenuItems'
import { Props } from './CurrentAccountSidebar.types'

const decentraland = VendorName.DECENTRALAND

const { COLLECTIONS, LAND, WEARABLES, EMOTES, ENS, ON_SALE, ON_RENT, SALES, BIDS, STORE_SETTINGS } = Sections.decentraland

const CurrentAccountSidebar = ({ section, onBrowse }: Props) => {
  const { changeFilter } = usePagination<keyof BrowseOptions>()

  return (
    <>
      <Menu>
        <Header sub>{t('account_sidebar.assets')}</Header>
        <MenuItem
          key={COLLECTIONS}
          value={COLLECTIONS}
          currentValue={section}
          onClick={section => changeFilter('section', section, { clearOldFilters: true })}
        />
        <NFTSectionsMenuItems
          sections={[LAND, WEARABLES, EMOTES, ENS]}
          section={section as Section}
          onSectionClick={section => onBrowse(decentraland, section)}
        />
      </Menu>
      <Menu>
        <Header sub>{t('account_sidebar.store')}</Header>
        <MenuItem key={ON_SALE} value={ON_SALE} currentValue={section} onClick={section => onBrowse(decentraland, section)} />
        <MenuItem key={ON_RENT} value={ON_RENT} currentValue={section} onClick={section => onBrowse(decentraland, section)} />
        <MenuItem key={SALES} value={SALES} currentValue={section} onClick={section => onBrowse(decentraland, section)} />
        <MenuItem key={BIDS} value={BIDS} currentValue={section} onClick={section => onBrowse(decentraland, section)} />
        <MenuItem key={STORE_SETTINGS} value={STORE_SETTINGS} currentValue={section} onClick={section => onBrowse(decentraland, section)} />
      </Menu>
      <AssetFilters
        defaultCollapsed={{
          [AssetFilter.Status]: true,
          [AssetFilter.Rarity]: true,
          [AssetFilter.Price]: true,
          [AssetFilter.Collection]: true,
          [AssetFilter.Creators]: true,
          [AssetFilter.PlayMode]: true,
          [AssetFilter.BodyShape]: true,
          [AssetFilter.Network]: true,
          [AssetFilter.OnSale]: false,
          [AssetFilter.More]: false
        }}
      />
    </>
  )
}

export default React.memo(CurrentAccountSidebar)
