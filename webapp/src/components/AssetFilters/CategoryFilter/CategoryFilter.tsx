import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, useMobileMediaQuery } from 'decentraland-ui'
import { useMemo } from 'react'
import { Section, Sections } from '../../../modules/vendor/routing/types'
import NFTSectionsMenuItems from '../../Vendor/decentraland/NFTSections/NFTSectionsMenuItems'
import './CategoryFilter.css'

type Props = {
  category?: NFTCategory
  section?: Section
  sections?: Section[]
  onChange: (section: Section) => void
}

export const CategoryFilter = ({ section, onChange }: Props): JSX.Element => {
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
      <NFTSectionsMenuItems
        section={section}
        sections={[
          Sections.decentraland.WEARABLES,
          Sections.decentraland.EMOTES,
          Sections.decentraland.ENS
        ]}
        onSectionClick={onChange}
      />
    </Box>
  )
}
