import { PriceFilter } from './PriceFilter'
import { Props } from './FiltersSidebar.types'
import './FiltersSidebar.css'

export const FiltersSidebar = ({ onBrowse, minPrice, maxPrice }: Props): JSX.Element => {

  function handlePriceChange(value: [string, string]) {
    const [minPrice, maxPrice] = value
    onBrowse({ minPrice, maxPrice })
  }

  return (
    <div className="filters-sidebar">
      <PriceFilter onChange={handlePriceChange} minPrice={minPrice} maxPrice={maxPrice} />
    </div>
  )
}
