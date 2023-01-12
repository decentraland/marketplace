import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, useMobileMediaQuery } from 'decentraland-ui'
import { useMemo } from 'react'
import NFTSectionsMenuItems from '../../../Vendor/decentraland/NFTSections/NFTSectionsMenuItems'
import { getAvailableSections } from './utils'
import { Props } from './CategoryFilter.types'
import './CategoryFilter.css'

export const CategoryFilter = ({ section, view, assetType, onChange }: Props): JSX.Element => {
  const isMobile = useMobileMediaQuery()

  const header = useMemo(
    () =>
      isMobile ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('nft_filters.category')}</span>
          <span className="box-filter-value">{t(`menu.${section}`)}</span>
        </div>
      ) : (
        t('nft_filters.category')
      ),
    [isMobile, section]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box category-filter"
      collapsible
      defaultCollapsed={true}
    >
      <ul className="Menu box-menu">
        <NFTSectionsMenuItems
          section={section}
          sections={getAvailableSections(view, section, assetType)}
          onSectionClick={onChange}
        />
      </ul>
    </Box>
  )
}
