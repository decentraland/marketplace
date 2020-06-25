import React, { useEffect } from 'react'
import { Page, Responsive } from 'decentraland-ui'

import {
  Section,
  getSearchCategory,
  getSearchWearableCategory
} from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { NFTCategory } from '../../modules/nft/types'
import { getSortOrder } from '../../modules/nft/utils'
import { useNavigate } from '../../modules/nft/hooks'
import { Vendors } from '../../modules/vendor/types'
import {
  MAX_QUERY_SIZE,
  MAX_PAGE,
  PAGE_SIZE
} from '../../modules/vendor/decentraland/apiClient'
import { NFTSidebar } from '../NFTSidebar'
import { NFTFilters } from '../NFTFilters'
import { NFTList } from '../NFTList'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { Props } from './NFTBrowse.types'
import './NFTBrowse.css'

const NFTBrowse = (props: Props) => {
  const {
    address,
    defaultOnlyOnSale,
    page,
    section,
    sortBy,
    view,
    wearableRarities,
    wearableGenders,
    contracts,
    search,
    onFetchNFTs
  } = props

  // "Instance" variables
  const onlyOnSale =
    props.onlyOnSale === undefined ? defaultOnlyOnSale : props.onlyOnSale

  // State variables
  const data = useNavigate()
  const isLoadMore = data[1]

  // Kick things off
  useEffect(() => {
    const offset = isLoadMore ? page - 1 : 0
    const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
    const first = Math.min(page * PAGE_SIZE - skip, MAX_QUERY_SIZE)

    const category = getSearchCategory(section)
    const [orderBy, orderDirection] = getSortOrder(sortBy)

    const isLand = section === Section.LAND
    const isWearableHead = section === Section.WEARABLES_HEAD
    const isWearableAccessory = section === Section.WEARABLES_ACCESORIES

    const wearableCategory =
      !isWearableAccessory && category === NFTCategory.WEARABLE
        ? getSearchWearableCategory(section)
        : undefined

    const fetchView = isLoadMore ? View.LOAD_MORE : view
    const vendor = Vendors.DECENTRALAND

    onFetchNFTs(
      fetchView,
      vendor,
      {
        first,
        skip,
        orderBy,
        orderDirection,
        onlyOnSale,
        address,
        category,
        search
      },
      {
        isLand,
        isWearableHead,
        isWearableAccessory,
        wearableRarities,
        wearableGenders,
        wearableCategory,
        contracts
      }
    )
  }, [
    isLoadMore,
    address,
    onlyOnSale,
    view,
    page,
    section,
    sortBy,
    wearableRarities,
    wearableGenders,
    contracts,
    search,
    onFetchNFTs
  ])

  return (
    <Page className="NFTBrowse">
      <Row>
        <Column align="left">
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <NFTSidebar />
          </Responsive>
        </Column>

        <Column align="right" grow={true}>
          <NFTFilters />
          <NFTList />
        </Column>
      </Row>
    </Page>
  )
}

export default React.memo(NFTBrowse)
