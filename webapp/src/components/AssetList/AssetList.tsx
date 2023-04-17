/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo } from 'react'
import { Card, Button, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { getMaxQuerySize, MAX_PAGE, PAGE_SIZE } from '../../modules/vendor/api'
import { AssetCard } from '../AssetCard'
import { Props } from './AssetList.types'
import './AssetList.css'
import { getCategoryFromSection } from '../../modules/routing/search'
import { NFTCategory } from '@dcl/schemas'

const AssetList = (props: Props) => {
  const {
    vendor,
    section,
    assetType,
    // items,
    // nfts,
    page,
    count,
    search,
    isLoading,
    // hasFiltersEnabled,
    onBrowse,
    urlNext,
    isManager,
    // onClearFilters,
    catalogItems
  } = props

  // const assets: (NFT | Item)[] = assetType === AssetType.ITEM ? items : nfts -> catalogItems

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
    (catalogItems.length !== count || count === maxQuerySize) &&
    page <= MAX_PAGE

  const isLoadingNewPage = isLoading && catalogItems.length >= PAGE_SIZE

  const emptyStateTranslationString = useMemo(() => {
    if (catalogItems.length > 0) {
      return ''
    } else if (section) {
      if (isManager) {
        return 'nft_list.simple_empty'
      }

      const isEmoteOrWearableSection = [
        NFTCategory.EMOTE,
        NFTCategory.WEARABLE
      ].includes(getCategoryFromSection(section)!)

      if (isEmoteOrWearableSection) {
        return search ? 'nft_list.empty_search' : 'nft_list.empty'
      }
    }
    return 'nft_list.simple_empty'
  }, [catalogItems.length, search, section, isManager])

  console.log(
    'flo a veeer',
    catalogItems.length,
    catalogItems,
    emptyStateTranslationString
  )

  return (
    <>
      {isLoading ? (
        <>
          <div className="overlay" />
          <Loader size="massive" active className="asset-loader" />
        </>
      ) : null}
      <Card.Group>
        {catalogItems.length > 0
          ? catalogItems.map((catalogItem, index) => (
              <>
                <AssetCard
                  isManager={isManager}
                  key={assetType + '-' + catalogItem.id + '-' + index}
                  asset={catalogItem}
                />
                {/* <div
                  key={index}
                  style={{ backgroundColor: 'yellow', color: 'black' }}
                >
                  Card chanchullo :)
                  <br></br>
                  {catalogItem.name}
                  <br></br>
                  {catalogItem.price}
                  <br></br>
                  {catalogItem.rarity}
                </div> */}
              </>
            ))
          : null}
      </Card.Group>

      {/* {assets.length === 0 && !isLoading ? (
        <div className="empty">
          <div className="watermelon" />

          <T
            id={emptyStateTranslationString}
            values={{
              search,
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
              'if-filters': (chunks: string) =>
                hasFiltersEnabled ? chunks : '',
              clearFilters: (chunks: string) => (
                <button className="empty-actions" onClick={onClearFilters}>
                  {chunks}
                </button>
              ),
              br: () => <br />
            }}
          />
        </div>
      ) : null} */}

      {catalogItems.length > 0 &&
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
