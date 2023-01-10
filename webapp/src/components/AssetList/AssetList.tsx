import React, { useCallback } from 'react'
import { Card, Button, Loader } from 'decentraland-ui'
import { Item, NFTCategory } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { getCategoryFromSection } from '../../modules/routing/search'
import { getMaxQuerySize, MAX_PAGE, PAGE_SIZE } from '../../modules/vendor/api'
import { AssetType } from '../../modules/asset/types'
import { NFT } from '../../modules/nft/types'
import { AssetCard } from '../AssetCard'
import { Props } from './AssetList.types'
import './AssetList.css'

const AssetList = (props: Props) => {
  const {
    vendor,
    section,
    assetType,
    items,
    nfts,
    page,
    count,
    isLoading,
    onBrowse,
    urlNext,
    isManager,
    onClearFilters
  } = props

  const assets: (NFT | Item)[] = assetType === AssetType.ITEM ? items : nfts

  const handleLoadMore = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const newPage = page + 1
      onBrowse({ page: newPage })
      getAnalytics().track('Load more', { page: newPage })
    },
    [onBrowse, page]
  )

  const maxQuerySize = getMaxQuerySize(vendor)

  const hasExtraPages =
    (assets.length !== count || count === maxQuerySize) && page <= MAX_PAGE

  const isLoadingNewPage = isLoading && nfts.length >= PAGE_SIZE

  return (
    <>
      <Card.Group>
        {assets.length > 0
          ? assets.map((assets, index) => (
              <AssetCard
                isManager={isManager}
                key={assetType + '-' + assets.id + '-' + index}
                asset={assets}
              />
            ))
          : null}

        {isLoading ? (
          <>
            <div className="overlay" />
            <Loader size="massive" active />
          </>
        ) : null}
      </Card.Group>

      {assets.length === 0 && !isLoading ? (
        <div className="empty">
          <div className="watermelon" />

          <T
            id={
              section &&
              [NFTCategory.EMOTE, NFTCategory.WEARABLE].includes(
                getCategoryFromSection(section)!
              )
                ? 'nft_list.empty'
                : 'nft_list.simple_empty'
            }
            values={{
              currentSection:
                assetType === AssetType.ITEM
                  ? t('browse_page.primary_market_title').toLocaleLowerCase()
                  : t('browse_page.secondary_market_title').toLocaleLowerCase(),
              section:
                assetType === AssetType.ITEM
                  ? t('browse_page.secondary_market_title').toLocaleLowerCase()
                  : t('browse_page.primary_market_title').toLocaleLowerCase(),
              searchStore: (chunks: string) => (
                <button
                  className="empty-actions"
                  onClick={() =>
                    onBrowse({
                      assetType:
                        assetType === AssetType.ITEM
                          ? AssetType.NFT
                          : AssetType.ITEM
                    })
                  }
                >
                  {chunks}
                </button>
              ),
              clearFilters: (chunks: string) => (
                <button className="empty-actions" onClick={onClearFilters}>
                  {chunks}
                </button>
              ),
              br: () => <br />
            }}
          />
        </div>
      ) : null}

      {assets.length > 0 &&
      hasExtraPages &&
      (!isLoading || isLoadingNewPage) ? (
        <div className="load-more">
          <Button
            as="a"
            href={urlNext}
            loading={isLoading}
            inverted
            primary
            onClick={handleLoadMore}
          >
            {t('global.load_more')}
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default React.memo(AssetList)
