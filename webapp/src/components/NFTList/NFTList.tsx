import React, { useCallback } from 'react'
import { Card, Button, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { MAX_QUERY_SIZE, MAX_PAGE } from '../../modules/nft/utils'
import { NFTCard } from '../NFTCard'
import { Props } from './NFTList.types'

const NFTList = (props: Props) => {
  const { nfts, page, count, isLoading, onBrowse } = props

  const handleLoadMore = useCallback(() => {
    onBrowse({ page: page + 1 })
  }, [onBrowse, page])

  const hasExtraPages =
    (nfts.length !== count || count === MAX_QUERY_SIZE) && page <= MAX_PAGE

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

      {nfts.length > 0 && (isLoading || hasExtraPages) ? (
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
