import React, { useEffect } from 'react'
import { Page, Responsive } from 'decentraland-ui'

import { getSearchCategory } from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import {
  MAX_QUERY_SIZE,
  MAX_PAGE,
  PAGE_SIZE,
  getSortOrder
} from '../../modules/nft/utils'
import { useNavigate } from '../../modules/nft/hooks'
import { useFilters } from '../../modules/vendor/hooks'
import { NFTFilters } from '../Vendor/NFTFilters'
import { NFTList } from '../NFTList'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { NFTSidebar } from '../Vendor/NFTSidebar'
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
    search,
    vendor,
    onFetchNFTs
  } = props

  // "Instance" variables
  const onlyOnSale =
    props.onlyOnSale === undefined ? defaultOnlyOnSale : props.onlyOnSale

  // State variables
  const [, isLoadMore] = useNavigate()
  const getFilters = useFilters(vendor)

  // Kick things off
  useEffect(() => {
    const offset = isLoadMore ? page - 1 : 0
    const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
    const first = Math.min(page * PAGE_SIZE - skip, MAX_QUERY_SIZE)

    const [orderBy, orderDirection] = getSortOrder(sortBy)
    const category = getSearchCategory(section)
    const filters = getFilters()

    onFetchNFTs({
      view: isLoadMore ? View.LOAD_MORE : view,
      vendor,
      params: {
        first,
        skip,
        orderBy,
        orderDirection,
        onlyOnSale,
        address,
        category,
        search,
        filters
      }
    })
  }, [
    isLoadMore,
    address,
    onlyOnSale,
    view,
    page,
    section,
    sortBy,
    search,
    vendor,
    getFilters,
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
