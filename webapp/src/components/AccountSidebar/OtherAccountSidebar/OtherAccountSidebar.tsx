import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import classNames from 'classnames'
import { Sections } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'
import { Menu } from '../../Menu'
import { Props } from './OtherAccountSidebar.types'
import NFTSectionsMenuItems from '../../Vendor/decentraland/NFTSections/NFTSectionsMenuItems'
import { AssetType } from '../../../modules/asset/types'

const { ALL, LAND, WEARABLES, ENS } = Sections.decentraland

const OtherAccountSidebar = ({ section, assetType, onBrowse }: Props) => (
  <>
    <Menu>
      <Header sub>{t('account_sidebar.my_store')}</Header>
      <div
        className={classNames(
          'item',
          assetType === AssetType.ITEM && 'selected'
        )}
        onClick={() =>
          onBrowse({ section: WEARABLES, assetType: AssetType.ITEM })
        }
      >
        <div className="primary">Originals</div>
        <div className="secondary">Original creations by users</div>
      </div>
      <div
        className={classNames(
          'item',
          assetType === AssetType.NFT && 'selected'
        )}
        onClick={() => onBrowse({ section: ALL, assetType: AssetType.NFT })}
      >
        <div className="primary">Listings</div>
        <div className="secondary">Items being resold</div>
      </div>
    </Menu>
    <Menu>
      <Header sub>
        {assetType === AssetType.ITEM ? 'CATEGORIES' : 'ASSETS'}
      </Header>
      <NFTSectionsMenuItems
        sections={
          assetType === AssetType.ITEM
            ? [WEARABLES]
            : [ALL, WEARABLES, LAND, ENS]
        }
        section={section as Section}
        onSectionClick={section => onBrowse({ section, assetType })}
      />
    </Menu>
  </>
)

export default React.memo(OtherAccountSidebar)
