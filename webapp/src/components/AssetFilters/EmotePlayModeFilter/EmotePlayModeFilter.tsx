import { useCallback, useMemo } from 'react'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { EmotePlayMode } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ArrayFilter } from '../../Vendor/NFTFilters/ArrayFilter'

export type NetworkFilterProps = {
  emotePlayMode?: EmotePlayMode[]
  onChange: (value: EmotePlayMode[]) => void
  defaultCollapsed?: boolean
}

export const EmotePlayModeFilter = ({
  emotePlayMode,
  onChange,
  defaultCollapsed = false
}: NetworkFilterProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const emotePlayModeOptions = useMemo(() => {
    const options = Object.values(EmotePlayMode).filter(
      value => typeof value === 'string'
    ) as EmotePlayMode[]
    return options.map(playMode => ({
      value: playMode,
      text: t(`emote.play_mode.${playMode}`)
    }))
  }, [])

  const handleChange = useCallback(
    (values: string[]) => onChange(values as EmotePlayMode[]),
    [onChange]
  )

  const areAllItemsSelected =
    emotePlayMode?.length === emotePlayModeOptions.length ||
    !emotePlayMode?.length

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">
            {t('nft_filters.emote_play_mode.title')}
          </span>
          <span className="box-filter-value">
            {areAllItemsSelected
              ? t('nft_filters.emote_play_mode.all_items')
              : emotePlayMode
                  .map(mode => t(`emote.play_mode.${mode}`))
                  .join(', ')}
          </span>
        </div>
      ) : (
        t('nft_filters.emote_play_mode.title')
      ),
    [areAllItemsSelected, emotePlayMode, isMobileOrTablet]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box emote-play-mode-filter"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <ArrayFilter
        options={emotePlayModeOptions}
        name=""
        onChange={handleChange}
        values={emotePlayMode || []}
      />
    </Box>
  )
}
