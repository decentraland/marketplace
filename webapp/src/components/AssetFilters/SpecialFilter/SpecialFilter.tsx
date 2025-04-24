import { useCallback, useMemo, ChangeEvent } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, SmartBadge, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Switch } from 'decentraland-ui2'
import CreditsIcon from '../../../images/icon-credits.svg'
import './SpecialFilter.css'

export type SpecialFilterProps = {
  isOnlySmart?: boolean
  withCredits?: boolean
  isCreditsEnabled?: boolean
  onSmartChange?: (value: boolean) => void
  onWithCreditsChange?: (value: boolean) => void
  'data-testid'?: string
  className?: string
  defaultCollapsed?: boolean
}

export const SpecialFilter = (props: SpecialFilterProps) => {
  const { isOnlySmart, withCredits, isCreditsEnabled, onSmartChange, onWithCreditsChange, className, defaultCollapsed = false } = props

  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const handleSmartChange = useCallback(
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onSmartChange?.(checked)
    },
    [onSmartChange]
  )

  const handleWithCreditsToggle = useCallback(
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onWithCreditsChange?.(checked)
    },
    [onWithCreditsChange]
  )

  const header = useMemo(
    () => (
      <div className="special-filter-header">
        {isMobileOrTablet ? (
          <>
            <span className="box-filter-name">{t('filters.special_filters')}</span>
            <span className="box-filter-value">
              {isOnlySmart ? t('filters.only_smart') : ''}
              {isOnlySmart && withCredits ? ', ' : ''}
              {withCredits ? t('filters.with_credits') : ''}
            </span>
          </>
        ) : (
          t('filters.special_filters')
        )}
      </div>
    ),
    [isMobileOrTablet, isOnlySmart, withCredits]
  )

  return (
    <Box
      header={header}
      className={classNames('special-filter', className)}
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <div className="special-filter-content" data-testid={props['data-testid']}>
        {isCreditsEnabled && (
          <div className="filter-option credits-filter">
            <div className="credits-left">
              <img src={CreditsIcon} alt="Credits" />
              <span className="credits-label">{t('filters.get_with_credits')}</span>
            </div>
            <Switch checked={withCredits} onChange={handleWithCreditsToggle} />
          </div>
        )}

        {!!onSmartChange && (
          <div className="filter-option smart-filter">
            <div className="smart-left">
              <SmartBadge clickable={false} />
            </div>
            <Switch checked={!!isOnlySmart} onChange={handleSmartChange} />
          </div>
        )}
      </div>
    </Box>
  )
}
