import React, { useCallback } from 'react'
import { Card, Button, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'

import { MAX_PAGE, PAGE_SIZE } from '../../modules/vendor/api'
import { Props } from './ItemList.types'
import { AssetCard } from '../AssetCard'

const ItemList = (props: Props) => {
  const { items, page, count, isLoading, onBrowse } = props

  const handleLoadMore = useCallback(() => {
    const newPage = page + 1
    onBrowse({ page: newPage })
    getAnalytics().track('Load more', { page: newPage })
  }, [onBrowse, page])

  const hasExtraPages =
    (items.length !== count || count === 1000) && page <= MAX_PAGE

  const isLoadingNewPage = isLoading && items.length >= PAGE_SIZE

  return (
    <>
      <Card.Group>
        {items.length > 0
          ? items.map(item => <AssetCard key={item.id} asset={item} />)
          : null}

        {isLoading ? (
          <>
            <div className="overlay" />
            <Loader size="massive" active />
          </>
        ) : null}
      </Card.Group>

      {items.length === 0 && !isLoading ? (
        <div className="empty">{t('nft_list.empty')}</div>
      ) : null}

      {items.length > 0 && hasExtraPages && (!isLoading || isLoadingNewPage) ? (
        <div className="load-more">
          <Button loading={isLoading} inverted primary onClick={handleLoadMore}>
            {t('global.load_more')}
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default React.memo(ItemList)
