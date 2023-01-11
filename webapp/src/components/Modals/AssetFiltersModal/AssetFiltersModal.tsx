import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetFilters } from '../../AssetFilters'
import { Props } from './AssetFiltersModal.types'
import styles from './AssetFiltersModal.module.css'
import { BrowseOptions } from '../../../modules/routing/types'

const AssetFiltersModal = (props: Props) => {
  const [filters, setFilters] = useState<BrowseOptions>({})
  const { onClearFilters, onClose, onBrowse } = props

  const handleFilterChange = useCallback(
    (options: BrowseOptions) => {
      setFilters({ ...filters, ...options })
    },
    [filters]
  )

  const handleApplyFilters = useCallback(() => {
    onBrowse(filters)
  }, [onBrowse, filters])

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
