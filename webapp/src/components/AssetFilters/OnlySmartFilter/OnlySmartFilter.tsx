import { useMemo, useCallback } from 'react'
import {
  Box,
  Checkbox,
  CheckboxProps,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import SmartBadge from '../../AssetPage/SmartBadge'
import styles from './OnlySmartFilter.module.css'

export type OnlySmartFilterProps = {
  isOnlySmart?: boolean
  onChange: (value: boolean) => void
  defaultCollapsed?: boolean
}

export const OnlySmartFilter = ({
  isOnlySmart,
  onChange,
  defaultCollapsed = false
}: OnlySmartFilterProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const handleOnlySmartChange = useCallback(
    (_, props: CheckboxProps) => {
      onChange(!!props.checked)
    },
    [onChange]
  )

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">
            {t('nft_filters.only_smart.title')}
          </span>
          <span className="box-filter-value">
            {/* TODO: modify wording after product feedback */}
            {isOnlySmart ? t('nft_filters.only_smart.selected') : ''}
          </span>
        </div>
      ) : (
        t('nft_filters.only_smart.title')
      ),
    [isMobileOrTablet, isOnlySmart]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <div className={styles.onlySmartFilterSection}>
        <SmartBadge clickable={false} />
        <Checkbox
          toggle
          checked={!!isOnlySmart}
          onChange={handleOnlySmartChange}
        />
      </div>
    </Box>
  )
}
