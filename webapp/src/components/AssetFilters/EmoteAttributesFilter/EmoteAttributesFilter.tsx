import { useCallback, useMemo } from 'react'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { EmotePlayMode } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ArrayFilter } from '../../Vendor/NFTFilters/ArrayFilter'
import { Props } from './EmoteAttributesFilter.types'
const WITH_SOUND_VALUE = 'sound'
const WITH_GEOMETRY_VALUE = 'geometry'

export const EmoteAttributesFilter = ({
  emotePlayMode,
  emoteHasSound,
  emoteHasGeometry,
  onChange,
  defaultCollapsed = false,
  isEmotesV2Enabled
}: Props) => {
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

  const emoteAttributesOptions = useMemo(() => {
    return [
      {
        value: WITH_SOUND_VALUE,
        text: t('nft_filters.emote_attributes.with_sound')
      },
      {
        value: WITH_GEOMETRY_VALUE,
        text: t('nft_filters.emote_attributes.with_props')
      }
    ]
  }, [])

  const emoteAttributes = useMemo(() => {
    const attributes = []
    if (emoteHasSound) {
      attributes.push(WITH_SOUND_VALUE)
    }
    if (emoteHasGeometry) {
      attributes.push(WITH_GEOMETRY_VALUE)
    }
    return attributes
  }, [emoteHasSound, emoteHasGeometry])

  const handlePlayModeChange = useCallback(
    (values: string[]) =>
      onChange({ emotePlayMode: values as EmotePlayMode[] }),
    [onChange]
  )

  const handleEmoteAttributesChange = useCallback(
    (values: string[]) =>
      onChange({
        emoteHasSound: values.includes(WITH_SOUND_VALUE) || undefined,
        emoteHasGeometry: values.includes(WITH_GEOMETRY_VALUE) || undefined
      }),
    [onChange]
  )

  const areAllItemsSelected =
    emotePlayMode?.length === emotePlayModeOptions.length ||
    !emotePlayMode?.length

  const title = isEmotesV2Enabled
    ? t('nft_filters.emote_attributes.title')
    : t('nft_filters.emote_attributes.play_mode')
  const allTitle = isEmotesV2Enabled
    ? t('nft_filters.emote_attributes.all_items')
    : t('nft_filters.emote_attributes.all_play_modes')
  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{title}</span>
          <span className="box-filter-value">
            {areAllItemsSelected
              ? allTitle
              : emotePlayMode
                  .map(mode => t(`emote.play_mode.${mode}`))
                  .join(', ')}
          </span>
        </div>
      ) : (
        title
      ),
    [areAllItemsSelected, emotePlayMode, isMobileOrTablet, allTitle, title]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box emote-play-mode-filter"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      {isEmotesV2Enabled && (
        <ArrayFilter
          options={emoteAttributesOptions}
          name=""
          onChange={handleEmoteAttributesChange}
          values={emoteAttributes || []}
        />
      )}
      <ArrayFilter
        options={emotePlayModeOptions}
        name=""
        onChange={handlePlayModeChange}
        values={emotePlayMode || []}
      />
    </Box>
  )
}
