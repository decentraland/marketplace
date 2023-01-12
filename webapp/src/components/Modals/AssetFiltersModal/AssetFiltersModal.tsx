import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetFilters } from '../../AssetFilters'
import { Props } from './AssetFiltersModal.types'
import styles from './AssetFiltersModal.module.css'
import { BrowseOptions } from '../../../modules/routing/types'
import { AssetType } from '../../../modules/asset/types'
import { View } from '../../../modules/ui/types'
import { AssetTypeFilter } from './AssetTypeFilter'

const AssetFiltersModal = (props: Props) => {
  const [filters, setFilters] = useState<BrowseOptions>({})
  const { onClearFilters, onClose, onBrowse, view, assetType } = props

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

  return (
    <Modal open className={styles.assetFiltersModal}>
      <Modal.Header className={styles.modalHeader}>
        <Button basic className="clear-filters-modal" onClick={onClearFilters}>
          {t('filters.reset')}
        </Button>
        <h3 className={styles.modalTitle}>Filters</h3>
        <Button
          basic
          className={styles.closeButton}
          onClick={evt => onClose && onClose(evt, {})}
        />
      </Modal.Header>
      <Modal.Content>
        {view === View.ACCOUNT ? <AssetTypeFilter onChange={handleAssetTypeChange} assetType={filters.assetType || assetType} /> : null}
        <AssetFilters onFilterChange={handleFilterChange} values={filters} />
      </Modal.Content>
      <Modal.Actions className={styles.modalFooter}>
        <Button
          className={styles.applyFilters}
          primary
          onClick={handleApplyFilters}
        >
          {t('filters.apply')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(AssetFiltersModal)
