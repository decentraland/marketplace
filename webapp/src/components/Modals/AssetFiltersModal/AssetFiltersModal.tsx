import React, { useCallback, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Modal } from 'decentraland-ui'
import { AssetType } from '../../../modules/asset/types'
import { BrowseOptions } from '../../../modules/routing/types'
import { getClearedBrowseOptions } from '../../../modules/routing/utils'
import { View } from '../../../modules/ui/types'
import { Section } from '../../../modules/vendor/routing/types'
import { AssetFilters } from '../../AssetFilters'
import { AssetTypeFilter } from './AssetTypeFilter'
import { CategoryFilter } from './CategoryFilter'
import { Props } from './AssetFiltersModal.types'
import styles from './AssetFiltersModal.module.css'

const AssetFiltersModal = (props: Props) => {
  const [filters, setFilters] = useState<BrowseOptions>({})
  const { onClose, onBrowse, view, assetType, browseOptions } = props

  const handleFilterChange = useCallback(
    (options: BrowseOptions) => {
      setFilters({ ...filters, ...options })
    },
    [filters]
  )

  const handleApplyFilters = useCallback(() => {
    onBrowse(filters)
  }, [onBrowse, filters])

  const handleAssetTypeChange = useCallback(
    (assetType: AssetType) => {
      setFilters({ ...filters, assetType })
    },
    [filters]
  )

  const handleSectionChange = useCallback(
    (section: Section) => {
      setFilters({ ...filters, section })
    },
    [filters]
  )

  const handleClearFilters = useCallback(() => {
    setFilters(getClearedBrowseOptions(browseOptions, true))
  }, [browseOptions])

  return (
    <Modal open className={styles.assetFiltersModal}>
      <Modal.Header className={styles.modalHeader}>
        <Button basic className="clear-filters-modal" onClick={handleClearFilters}>
          {t('filters.reset')}
        </Button>
        <h3 className={styles.modalTitle}>Filters</h3>
        <Button basic className={styles.closeButton} onClick={evt => onClose && onClose(evt, {})} />
      </Modal.Header>
      <Modal.Content>
        {view === View.ACCOUNT ? <AssetTypeFilter onChange={handleAssetTypeChange} assetType={filters.assetType || assetType} /> : null}
        <CategoryFilter onChange={handleSectionChange} values={filters} />
        <AssetFilters onFilterChange={handleFilterChange} values={filters} />
      </Modal.Content>
      <Modal.Actions className={styles.modalFooter}>
        <Button className={styles.applyFilters} primary onClick={handleApplyFilters}>
          {t('filters.apply')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(AssetFiltersModal)
