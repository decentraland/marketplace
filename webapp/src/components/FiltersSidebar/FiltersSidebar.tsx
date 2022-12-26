import { Network, Rarity } from '@dcl/schemas'
import { PriceFilter } from './PriceFilter'
import { RarityFilter } from './RarityFilter'
import { NetworkFilter } from './NetworkFilter'
import { Props } from './FiltersSidebar.types'
import './FiltersSidebar.css'

export const FiltersSidebar = ({
  minPrice,
  maxPrice,
  rarities,
  network,
  onBrowse
}: Props): JSX.Element => {

  function handlePriceChange(value: [string, string]) {
    const [minPrice, maxPrice] = value
    onBrowse({ minPrice, maxPrice })
  }

  function handleRarityChange(value: Rarity[]) {
    onBrowse({ rarities: value })
  }

  function handleNetworkChange(value: Network) {
    onBrowse({ network: value })
  }

  return (
    <div className="filters-sidebar">
      <RarityFilter onChange={handleRarityChange} rarities={rarities} />
      <PriceFilter onChange={handlePriceChange} minPrice={minPrice} maxPrice={maxPrice} />
      <NetworkFilter onChange={handleNetworkChange} network={network} />
    </div>
  )
}
