import React, { useCallback } from 'react'
import { Card, Button, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { useNavigate } from '../../modules/nft/hooks'
import { MAX_QUERY_SIZE, MAX_PAGE } from '../../modules/nft/utils'
import { NFTCard } from '../NFTCard'
import { Props } from './NFTList.types'

const NFTList = (props: Props) => {
  const { nfts, page, count, isLoading } = props
  const [navigate] = useNavigate()

  const handleLoadMore = useCallback(() => {
    navigate({ page: page + 1 })
  }, [page, navigate])

  return (
    <>
      <Card.Group>
        {nfts.length > 0
          ? nfts.map(nft => <NFTCard key={nft.id} nft={nft} />)
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

      {(nfts.length !== count || count === MAX_QUERY_SIZE) &&
      page <= MAX_PAGE ? (
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
