import { useCallback } from 'react'
import { Box, Checkbox, CheckboxProps } from 'decentraland-ui'
import { useTabletAndBelowMediaQuery } from 'decentraland-ui/dist/components/Media'
import SmartBadge from '../../AssetPage/SmartBadge'
import styles from './OnlySmartFilter.module.css'

export type OnlySmartFilterProps = {
  isOnlySmart?: boolean
  onChange: (value: boolean) => void
  defaultCollapsed?: boolean
  'data-testid'?: string
}

export const OnlySmartFilterContent = (
  props: Pick<OnlySmartFilterProps, 'isOnlySmart' | 'onChange' | 'data-testid'>
) => {
  const { isOnlySmart, onChange } = props

  const handleChange = useCallback(
    (_, props: CheckboxProps) => {
      onChange(!!props.checked)
    },
    [onChange]
  )

  return (
    <div
      className={styles.onlySmartFilterSection}
      data-testid={props['data-testid']}
    >
      <SmartBadge clickable={false} />
      <Checkbox toggle checked={!!isOnlySmart} onChange={handleChange} />
    </div>
  )
}

export const OnlySmartFilter = ({
  isOnlySmart,
  onChange,
  defaultCollapsed = false
}: OnlySmartFilterProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  return isMobileOrTablet ? null : (
    <Box className="filters-sidebar-box" defaultCollapsed={defaultCollapsed}>
      <OnlySmartFilterContent isOnlySmart={isOnlySmart} onChange={onChange} />
    </Box>
  )
}
