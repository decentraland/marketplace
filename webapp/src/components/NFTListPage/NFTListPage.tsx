import React, { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Grid, Card, Loader } from 'decentraland-ui'

import { NFTCard } from '../NFTCard'
import { CategoriesMenu } from '../CategoriesMenu'
import { getSearchCategory, Section } from '../../modules/routing/search'
import { SearchOptions } from '../../modules/routing/search'
import { MAX_QUERY_SIZE } from '../../lib/api/client'
import { Props } from './NFTListPage.types'
import './NFTListPage.css'

const NFTListPage = (props: Props) => {
  const {
    address,
    account,
    onlyOnSale,
    page,
    section,
    sortBy,
    nfts,
    view,
    isLoading,
    onFetchNFTs,
    onNavigate
  } = props

  const handleOnNavigate = useCallback(
    (options?: SearchOptions) => onNavigate(options),
    [onNavigate]
  )

  const [offset] = useState(0)

  // @nico TODO: Support LoadMore. Maybe extract it from MarketPage first to avoid repetition
  useEffect(() => {
    const category = getSearchCategory(section)
    const isLand = section === Section.LAND

    onFetchNFTs({
      variables: {
        first: MAX_QUERY_SIZE,
        skip: 0,
        onlyOnSale,
        isLand,
        category,
        address
      },
      view
    })
  }, [address, onlyOnSale, view, offset, page, section, sortBy, onFetchNFTs])

  return (
    <Page className="NFTListPage">
      <Grid.Column>
        <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
      </Grid.Column>
      <Grid.Column className="right-column">
        <div>
          {isLoading ? (
            <Loader size="massive" active />
          ) : address && !account ? (
            <div className="empty">
              {t('nft_list_page.empty_account', { address })}
            </div>
          ) : (
            <Card.Group>
              {nfts.map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </Card.Group>
          )}
        </div>
      </Grid.Column>
    </Page>
  )
}

export default React.memo(NFTListPage)
