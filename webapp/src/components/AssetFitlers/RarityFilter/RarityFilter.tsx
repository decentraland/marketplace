import { useMemo, useCallback } from 'react'
import { Box } from 'decentraland-ui'
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

  return (
    <Box
      header={t('nft_filters.rarity')}
      className="filters-sidebar-box"
      collapsible
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
