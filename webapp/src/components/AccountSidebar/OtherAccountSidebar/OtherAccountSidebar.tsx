import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
// import { Sections } from '../../../modules/routing/types'
// import { Section } from '../../../modules/vendor/decentraland'
import { VendorName } from '../../../modules/vendor/types'
import { Menu } from '../../Menu'
// import { MenuItem } from '../../Menu/MenuItem'
import { Props } from './OtherAccountSidebar.types'
// import NFTSectionsMenuItems from '../../Vendor/decentraland/NFTSections/NFTSectionsMenuItems'
import { AssetType } from '../../../modules/asset/types'
import './OtherAccountSidebar.css'
import classNames from 'classnames'

const decentraland = VendorName.DECENTRALAND

// const {
//   COLLECTIONS,
//   LAND,
//   WEARABLES,
//   ENS,
//   ON_SALE,
//   SALES,
//   STORE_SETTINGS
// } = Sections.decentraland

const OtherAccountSidebar = ({ section, assetType, onBrowse }: Props) => (
  <div className="OtherAccountSidebar">
    <Menu>
      <Header sub>{t('account_sidebar.my_store')}</Header>
      <div
        className={classNames(
          'item',
          assetType === AssetType.ITEM && 'selected'
        )}
        onClick={() => onBrowse(decentraland, section, AssetType.ITEM)}
      >
        <div className="primary">Originals</div>
        <div className="secondary">Original creations by users</div>
      </div>
      <div
        className={classNames(
          'item',
          assetType === AssetType.NFT && 'selected'
        )}
        onClick={() => onBrowse(decentraland, section, AssetType.NFT)}
      >
        <div className="primary">Listings</div>
        <div className="secondary">Items being resold</div>
      </div>
    </Menu>
    {/* <Menu>
      <Header sub>{t('account_sidebar.my_assets')}</Header>
      <MenuItem
        key={COLLECTIONS}
        value={COLLECTIONS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section, AssetType.NFT)}
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
        key={STORE_SETTINGS}
        value={STORE_SETTINGS}
        currentValue={section}
        onClick={section => onBrowse(decentraland, section)}
      />
    </Menu> */}
  </div>
)

export default React.memo(OtherAccountSidebar)
