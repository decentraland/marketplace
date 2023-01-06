import { useCallback, useMemo } from 'react'
import { Box } from 'decentraland-ui'
import { EmotePlayMode } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ArrayFilter } from '../../Vendor/NFTFilters/ArrayFilter'

export type NetworkFilterProps = {
  emotePlayMode?: EmotePlayMode[]
  onChange: (value: EmotePlayMode[]) => void
}

export const EmotePlayModeFilter = ({
  emotePlayMode,
  onChange
}: NetworkFilterProps) => {
  const emotePlayModeOptions = useMemo(() => {
    const options = Object.values(EmotePlayMode).filter(
      value => typeof value === 'string'
    ) as EmotePlayMode[]
    return options.map(playMode => ({
      value: playMode,
      text: t(`emote.play_mode.${playMode}`)
    }))
  }, [])

  const handleChange = useCallback((values: string[]) => onChange(values as EmotePlayMode[]), [
    onChange
  ])

  return (
    <Box
      header={t('nft_filters.play_mode')}
      className="filters-sidebar-box emote-play-mode-filter"
      collapsible
    >
      <ArrayFilter options={emotePlayModeOptions} name='' onChange={handleChange} values={emotePlayMode || []} />
    </Box>
  )
}
