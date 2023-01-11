import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import classNames from 'classnames'
import { Sections } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'
import { Menu } from '../../Menu'
import { Props } from './OtherAccountSidebar.types'
import NFTSectionsMenuItems from '../../Vendor/decentraland/NFTSections/NFTSectionsMenuItems'
import { AssetFilters } from '../../AssetFilters'
import { AssetType } from '../../../modules/asset/types'

const { ALL, LAND, WEARABLES, EMOTES, ENS } = Sections.decentraland

const OtherAccountSidebar = ({ section, assetType, onBrowse }: Props) => (
  <>
    <Menu className="other-account-menu">
      <div
        className={classNames(
          'alternative-menu-item',
          assetType === AssetType.ITEM && 'selected'
        )}
        onClick={() =>
          onBrowse({ section: WEARABLES, assetType: AssetType.ITEM })
        }
      >
        <div className="alternative-menu-item-container">
          <span className="sparkles menu-icon" />
          <div>
            <div className="main-text">{t('account_sidebar.originals')}</div>
            <div className="detail-text">
              {t('account_sidebar.originals_detail')}
            </div>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          'alternative-menu-item',
          assetType === AssetType.NFT && 'selected'
        )}
        onClick={() => onBrowse({ section: ALL, assetType: AssetType.NFT })}
      >
        <div className="alternative-menu-item-container">
          <span className="assets menu-icon" />
          <div>
            <div className="main-text">{t('account_sidebar.listings')}</div>
            <div className="detail-text">
              {t('account_sidebar.listings_detail')}
            </div>
          </div>
        </div>
      </div>
    </Menu>
    <Menu className="categories-assets-menu">
      <Header sub>
        {assetType === AssetType.ITEM ? 'CATEGORIES' : 'ASSETS'}
      </Header>
      <NFTSectionsMenuItems
        sections={
          assetType === AssetType.ITEM
            ? [WEARABLES, EMOTES]
            : [ALL, WEARABLES, LAND, EMOTES, ENS]
        }
        section={section as Section}
        onSectionClick={section => onBrowse({ section, assetType })}
      />
    </Menu>
    <AssetFilters />
  </>
)

export default React.memo(OtherAccountSidebar)
