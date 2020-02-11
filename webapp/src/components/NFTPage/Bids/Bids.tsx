import React, { useEffect, useMemo } from 'react'
import { Header } from 'decentraland-ui'
import { Props } from './Bids.types'
import { Bid } from '../../Bid'
import './Bids.css'

const Bids = (props: Props) => {
  const { nft, bids, onFetchBids } = props
  // this is because when you change from one nft detail to another you would still see the previous nft bids
  const filteredBids = useMemo(
    () =>
      bids.filter(
        bid =>
          bid.contractAddress === nft.contractAddress &&
          bid.tokenId === nft.tokenId
      ),
    [nft]
  )

  useEffect(() => {
    if (filteredBids.length === 0) {
      onFetchBids(nft)
    }
  }, [filteredBids, onFetchBids, nft])

  return bids.length > 0 ? (
    <div className="Bids">
      <Header sub>Bids</Header>
      <div className="list">
        {filteredBids.map(bid => (
          <Bid key={bid.id} bid={bid} isArchivable={false} hasImage={false} />
        ))}
      </div>
    </div>
  ) : null
}

export default React.memo(Bids)
