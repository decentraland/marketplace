import { useCallback, useMemo } from 'react'
import { Box, Radio, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetStatusFilter } from '../../../utils/filters'
import { BrowseOptions } from '../../../modules/routing/types'
import { InfoTooltip } from '../../InfoTooltip'
import './StatusFilter.css'

export type StatusFilterFilterProps = {
  status?: AssetStatusFilter
  onChange: (value: BrowseOptions) => void
  defaultCollapsed?: boolean
}

export const StatusFilter = ({
  status,
  onChange,
  defaultCollapsed = false
}: StatusFilterFilterProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const statusOptions = useMemo(
    () =>
      Object.keys(AssetStatusFilter).map(opt => ({
        value: opt.toLocaleLowerCase(),
        text: t(`nft_filters.status.${opt.toLocaleLowerCase()}`)
      })),
    []
  )

  const handleChange = useCallback(
    (_evt, { value }) => {
      let options: BrowseOptions = { status: value }
      if (value === AssetStatusFilter.NOT_FOR_SALE) {
        options = { ...options, minPrice: undefined, maxPrice: undefined }
      }
      return onChange(options)
    },
    [onChange]
  )

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">
            {t('nft_filters.status.title')}
          </span>
          <span className="box-filter-value">
            {status
              ? t(`nft_filters.status.${status}`)
              : t('nft_filters.status.on_sale')}
          </span>
        </div>
      ) : (
        t('nft_filters.status.title')
      ),
    [isMobileOrTablet, status]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box asset-status-filter"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <div className="asset-status-options filters-radio-group">
        {statusOptions.map(option => (
          <Radio
            type="radio"
            key={option.value || 'all'}
            onChange={handleChange}
            label={
              <label>
                {option.text}
                {option.value !== AssetStatusFilter.NOT_FOR_SALE ? (
                  <InfoTooltip
                    content={t(`nft_filters.status.${option.value}_tooltip`)}
                  />
                ) : null}
              </label>
            }
            value={option.value}
            name="status"
            checked={option.value === status}
          />
        ))}
      </div>
    </Box>
  )
}
