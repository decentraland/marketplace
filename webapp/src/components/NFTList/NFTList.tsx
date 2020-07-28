import React, { useCallback } from 'react'
import { Card, Button, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { getMaxQuerySize, MAX_PAGE, PAGE_SIZE } from '../../modules/vendor/api'
import { NFTCard } from '../NFTCard'
import { Props } from './NFTList.types'

const NFTList = (props: Props) => {
  const { vendor, nfts, page, count, isLoading, onBrowse } = props

  const handleLoadMore = useCallback(() => {
    onBrowse({ page: page + 1 })
  }, [onBrowse, page])

  const maxQuerySize = getMaxQuerySize(vendor)

  const hasExtraPages =
    (nfts.length !== count || count === maxQuerySize) && page <= MAX_PAGE

  const isLoadingNewPage = isLoading && nfts.length >= PAGE_SIZE

  return (
    <>
      <Card.Group>
        {nfts.length > 0
          ? nfts.map((nft, index) => (
              <NFTCard key={nft.id + '-' + index} nft={nft} />
            ))
          : null}

        {isLoading ? (
          <>
            <div className="overlay" />
            <Loader size="massive" active />
          </>
        ) : null}
      </Card.Group>

      {nfts.length === 0 && !isLoading ? (
        <div className="empty">{t('nft_list.empty')}</div>
      ) : null}

      {nfts.length > 0 && hasExtraPages && (!isLoading || isLoadingNewPage) ? (
        <div className="load-more">
          <Button loading={isLoading} inverted primary onClick={handleLoadMore}>
            {t('global.load_more')}
          </Button>
        </div>
      ) : null}
    </>
  )
}

export default React.memo(NFTList)
