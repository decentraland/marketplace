import { PriceFilter } from './PriceFilter'
import { Props } from './FiltersSidebar.types'
import { CollectionFilter } from './CollectionFilter/CollectionFilter'
import './FiltersSidebar.css'

export const FiltersSidebar = ({ onBrowse, minPrice, maxPrice, collection, onlyOnSale }: Props): JSX.Element => {

  function handlePriceChange(value: [string, string]) {
    const [minPrice, maxPrice] = value
    onBrowse({ minPrice, maxPrice })
  }

  function handleCollectionChange(value: string | undefined) {
    const newValue = value ? [value] : [];
    onBrowse({ contracts: newValue })
  }

  return (
    <div className="filters-sidebar">
      <PriceFilter onChange={handlePriceChange} minPrice={minPrice} maxPrice={maxPrice} />
      <CollectionFilter onChange={handleCollectionChange} collection={collection} onlyOnSale={onlyOnSale}  />
    </div>
  )
}
