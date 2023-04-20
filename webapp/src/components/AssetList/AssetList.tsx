import React, { useCallback } from 'react'
import { Card, Button, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { getMaxQuerySize, MAX_PAGE, PAGE_SIZE } from '../../modules/vendor/api'
import { AssetCard } from '../AssetCard'
import { Props } from './AssetList.types'
import './AssetList.css'

const AssetList = (props: Props) => {
  const {
    vendor,
    page,
    count,
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

  return (
    <>
      {isLoading ? (
        <>
          <div className="overlay" />
          <Loader size="massive" active className="asset-loader" />
        </>
      ) : null}
      <Card.Group>
        {catalogItems.map((catalogItem, index) => (
          <AssetCard
            isManager={isManager}
            key={catalogItem.id + '-' + index}
            asset={catalogItem}
          />
        ))}
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
