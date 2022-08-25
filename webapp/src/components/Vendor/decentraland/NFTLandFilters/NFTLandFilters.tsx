import { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Option, RadioBox } from '../../../AssetBrowse/RadioBox'
import { LandFilter, Props } from './NFTLandFilters.types'
import styles from './NFTLandFilters.module.css'

const NFTLandFilters = (props: Props) => {
  const { onLandFilterChange, selectedFilter } = props

  const options = [
    {
      name: t('nft_land_filters.only_for_sale'),
      value: LandFilter.SALE
    },
    {
      name: t('nft_land_filters.only_for_rent'),
      value: LandFilter.RENT
    },
    {
      name: t('nft_land_filters.all_land'),
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
      header={t('filters.status')}
      className={styles.NFTLandFilters}
      value={selectedFilter}
      items={options}
      onClick={handleLandFilterChange}
    />
  )
}

export default NFTLandFilters
