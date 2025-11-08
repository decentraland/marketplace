import { useCallback, useMemo } from 'react'
import { EmoteOutcomeType, EmotePlayMode } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ArrayFilter } from 'decentraland-ui/dist/components/ArrayFilter'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Props } from './EmoteAttributesFilter.types'
const WITH_SOUND_VALUE = 'sound'
const WITH_GEOMETRY_VALUE = 'geometry'
// TODO: For now, let's filter if it has outcome or not
const WITH_OUTCOME_VALUE = EmoteOutcomeType.SIMPLE_OUTCOME

export const EmoteAttributesFilter = ({
  emotePlayMode,
  emoteHasSound,
  emoteHasGeometry,
  emoteOutcomeType,
  onChange,
  defaultCollapsed = false
}: Props) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const emotePlayModeOptions = useMemo(() => {
    const options = Object.values(EmotePlayMode).filter(value => typeof value === 'string') as EmotePlayMode[]
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
      },
      {
        value: WITH_OUTCOME_VALUE,
        text: t('nft_filters.emote_attributes.social')
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
    if (emoteOutcomeType) {
      attributes.push(WITH_OUTCOME_VALUE)
    }
    return attributes
  }, [emoteHasSound, emoteHasGeometry, emoteOutcomeType])

  const handlePlayModeChange = useCallback(
    (values: string[]) =>
      onChange({
        emotePlayMode: values as EmotePlayMode[],
        emoteHasSound,
        emoteHasGeometry,
        emoteOutcomeType
      }),
    [emoteHasGeometry, emoteHasSound, emoteOutcomeType, onChange]
  )

  const handleEmoteAttributesChange = useCallback(
    (values: string[]) =>
      onChange({
        emoteHasSound: values.includes(WITH_SOUND_VALUE) || undefined,
        emoteHasGeometry: values.includes(WITH_GEOMETRY_VALUE) || undefined,
        emoteOutcomeType: values.includes(WITH_OUTCOME_VALUE) ? WITH_OUTCOME_VALUE : undefined,
        emotePlayMode
      }),
    [emotePlayMode, onChange]
  )

  const areAllItemsSelected = emotePlayMode?.length === emotePlayModeOptions.length || !emotePlayMode?.length

  const title = t('nft_filters.emote_attributes.title')
  const allTitle = t('nft_filters.emote_attributes.all_items')
  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{title}</span>
          <span className="box-filter-value">
            {areAllItemsSelected ? allTitle : emotePlayMode.map(mode => t(`emote.play_mode.${mode}`)).join(', ')}
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
      <ArrayFilter
        className="Filters"
        options={emoteAttributesOptions}
        onChange={handleEmoteAttributesChange}
        values={emoteAttributes || []}
      />
      <ArrayFilter className="Filters" options={emotePlayModeOptions} onChange={handlePlayModeChange} values={emotePlayMode || []} />
    </Box>
  )
}
