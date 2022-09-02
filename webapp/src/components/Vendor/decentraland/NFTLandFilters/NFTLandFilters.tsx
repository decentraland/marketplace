import { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Option, RadioBox } from '../../../AssetBrowse/RadioBox'
import { browseRentedLAND } from '../utils'
import { LANDFilters } from '../types'
import { Props } from './NFTLandFilters.types'
import styles from './NFTLandFilters.module.css'

const NFTLandFilters = (props: Props) => {
  const { onLandFilterChange, selectedFilter } = props

  const options = [
    {
      name: t('nft_land_filters.only_for_sale'),
      value: LANDFilters.ONLY_FOR_SALE
    },
    {
      name: t('nft_land_filters.only_for_rent'),
      value: LANDFilters.ONLY_FOR_RENT
    },
    {
      name: t('nft_land_filters.all_land'),
      value: LANDFilters.ALL_LAND
    }
  ]

  const handleLandFilterChange = useCallback(
    (option: Option) => browseRentedLAND(onLandFilterChange, option.value),
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
