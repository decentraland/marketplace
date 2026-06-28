import { useCallback } from 'react'
import { Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Checkbox } from 'decentraland-ui'
import { FilterPopover } from '../FilterPopover/FilterPopover'
import './RarityDropdown.css'

// Rarest first, matching the order used by the legacy RarityFilter.
const RARITIES: Rarity[] = [
  Rarity.UNIQUE,
  Rarity.MYTHIC,
  Rarity.EXOTIC,
  Rarity.LEGENDARY,
  Rarity.EPIC,
  Rarity.RARE,
  Rarity.UNCOMMON,
  Rarity.COMMON
]

export type RarityDropdownProps = {
  rarities: Rarity[]
  onChange: (rarities: Rarity[]) => void
}

export const RarityDropdown = ({ rarities, onChange }: RarityDropdownProps) => {
  const handleToggle = useCallback(
    (rarity: Rarity) => {
      const next = rarities.includes(rarity) ? rarities.filter(r => r !== rarity) : [...rarities, rarity]
      onChange(next)
    },
    [rarities, onChange]
  )

  return (
    <FilterPopover label={t('global.rarity')} active={rarities.length > 0} badge={rarities.length || undefined}>
      <div className="RarityDropdown">
        {RARITIES.map(rarity => (
          <button type="button" key={rarity} className="RarityDropdown__option" onClick={() => handleToggle(rarity)}>
            <Checkbox checked={rarities.includes(rarity)} readOnly />
            <span className="RarityDropdown__name">{t(`@dapps.rarities.${rarity}`)}</span>
          </button>
        ))}
      </div>
    </FilterPopover>
  )
}

export default RarityDropdown
