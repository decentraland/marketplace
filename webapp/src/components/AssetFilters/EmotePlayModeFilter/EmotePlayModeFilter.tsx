import { useCallback, useMemo } from 'react'
import { Box, useMobileMediaQuery } from 'decentraland-ui'
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
  const isMobile = useMobileMediaQuery();
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

  const mobileBoxHeader = (
    <div className='mobile-box-header'>
      <span className="box-filter-name">{t('nft_filters.play_mode')}</span>
      <span className='box-filter-value'>All land statuses</span>
    </div>
  )

  return (
    <Box
      header={isMobile ? mobileBoxHeader : t('nft_filters.play_mode')}
      className="filters-sidebar-box emote-play-mode-filter"
      collapsible
      defaultCollapsed={isMobile}
    >
      <ArrayFilter options={emotePlayModeOptions} name='' onChange={handleChange} values={emotePlayMode || []} />
    </Box>
  )
}
