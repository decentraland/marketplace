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
    page,
    count,
    search,
    isLoading,
    onBrowse,
    urlNext,
    isManager,
    catalogItems
  } = props

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
                  key={catalogItem.id + '-' + index}
                  asset={catalogItem}
                />
              </>
            ))
          : null}
      </Card.Group>

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
