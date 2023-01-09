import { useMemo, useCallback } from 'react'
import { Box, useMobileMediaQuery } from 'decentraland-ui'
import { Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ArrayFilter } from '../../Vendor/NFTFilters/ArrayFilter'

export type RarityFilterProps = {
  rarities: string[]
  onChange: (value: Rarity[]) => void
}

export const RarityFilter = ({
  onChange,
  rarities = []
}: RarityFilterProps) => {
  const isMobile = useMobileMediaQuery()
  const rarityOptions = useMemo(() => {
    const options = Object.values(Rarity)
      .filter(value => typeof value === 'string')
      .reverse() as string[]
    return options.map(rarity => ({
      value: rarity,
      text: t(`rarity.${rarity}`)
    }))
  }, [])

  const handleRaritiesChange = useCallback(
    (newValue: string[]) => {
      onChange(newValue as Rarity[])
    },
    [onChange]
  )

  const allRaritiesSelected =
    rarities.length === 0 || rarities.length === rarityOptions.length

  const mobileBoxHeader = (
    <div className="mobile-box-header">
      <span className="box-filter-name">{t('nft_filters.rarities.title')}</span>
      <span className="box-filter-value">
        {allRaritiesSelected
          ? t('nft_filters.rarities.all_items')
          : t('nft_filters.rarities.count_items', { count: rarities.length })}
      </span>
    </div>
  )

  return (
    <Box
      header={isMobile ? mobileBoxHeader : t('nft_filters.rarities.title')}
      className="filters-sidebar-box"
      collapsible
      defaultCollapsed={isMobile}
    >
      <ArrayFilter
        name=""
        options={rarityOptions}
        onChange={handleRaritiesChange}
        values={rarities}
      />
    </Box>
  )
}
