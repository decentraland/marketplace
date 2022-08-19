import { useCallback } from 'react'
import { Option, RadioBox } from '../../../AssetBrowse/RadioBox'
import { LandFilter, Props } from './NFTLandFilters.types'
import styles from './NFTLandFilters.module.css'

const NFTLandFilters = (props: Props) => {
  const { onLandFilterChange, selectedFilter } = props

  const options = [
    {
      name: 'Only for sale',
      value: LandFilter.SALE
    },
    {
      name: 'Only for rent',
      value: LandFilter.RENT
    },
    {
      name: 'All land',
      value: LandFilter.ALL
    }
  ]

  const handleLandFilterChange = useCallback(
    (option: Option) => {
      switch (option.value) {
        case LandFilter.SALE:
          onLandFilterChange({ onlyOnSale: true, onlyOnRent: undefined })
          break
        case LandFilter.RENT:
          onLandFilterChange({ onlyOnSale: undefined, onlyOnRent: true })
          break
        case LandFilter.ALL:
          onLandFilterChange({ onlyOnSale: undefined, onlyOnRent: undefined })
          break
      }
    },
    [onLandFilterChange]
  )

  return (
    <RadioBox
      header="STATUS"
      className={styles.NFTLandFilters}
      value={selectedFilter}
      items={options}
      onClick={handleLandFilterChange}
    />
  )
}

export default NFTLandFilters
