import { useCallback, useMemo } from 'react'
import { Box, Radio } from 'decentraland-ui'
import { EmotePlayMode } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './EmotePlayModeFilter.css'

export type NetworkFilterProps = {
  emotePlayMode?: EmotePlayMode
  onChange: (value: EmotePlayMode) => void
}

export const EmotePlayModeFilter = ({
  emotePlayMode,
  onChange
}: NetworkFilterProps) => {
  const emotePlayModeOptions = useMemo(() => {
    const options = Object.values(EmotePlayMode).filter(
      value => typeof value === 'string'
    ) as EmotePlayMode[]
    return [
      {
        value: undefined,
        text: t('nft_filters.all_play_modes')
      },
      ...options.map(playMode => ({
        value: playMode,
        text: t(`emote.play_mode.${playMode}`)
      }))
    ]
  }, [])

  const handleChange = useCallback((_, { value }) => onChange(value), [
    onChange
  ])

  return (
    <Box
      header={t('nft_filters.play_mode')}
      className="filters-sidebar-box emote-play-mode-filter"
      collapsible
    >
      <div className="emote-play-mode-options filters-radio-group">
        {emotePlayModeOptions.map(option => (
          <Radio
            type="radio"
            key={option.text}
            onChange={handleChange}
            label={option.text}
            value={option.value}
            name="network"
            checked={emotePlayMode === option.value}
          />
        ))}
      </div>
    </Box>
  )
}
