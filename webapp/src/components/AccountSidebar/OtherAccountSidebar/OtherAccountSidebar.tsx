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

const { ALL, LAND, WEARABLES, EMOTES, ENS } = Sections.decentraland

const OtherAccountSidebar = ({ section, assetType, onBrowse }: Props) => (
  <>
    <Menu>
      <Header sub>{t('account_sidebar.store')}</Header>
      <div
        className={classNames(
          'alternative-menu-item',
          assetType === AssetType.ITEM && 'selected'
        )}
        onClick={() =>
          onBrowse({ section: WEARABLES, assetType: AssetType.ITEM })
        }
      >
        <div className="main-text">{t('account_sidebar.originals')}</div>
        <div className="detail-text">
          {t('account_sidebar.originals_detail')}
        </div>
      </div>
      <div
        className={classNames(
          'alternative-menu-item',
          assetType === AssetType.NFT && 'selected'
        )}
        onClick={() => onBrowse({ section: ALL, assetType: AssetType.NFT })}
      >
        <div className="main-text">{t('account_sidebar.listings')}</div>
        <div className="detail-text">
          {t('account_sidebar.listings_detail')}
        </div>
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
            : [ALL, WEARABLES, LAND, EMOTES, ENS]
        }
        section={section as Section}
        onSectionClick={section => onBrowse({ section, assetType })}
      />
    </Menu>
  </>
)

export default React.memo(OtherAccountSidebar)
