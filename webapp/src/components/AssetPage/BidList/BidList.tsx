import React, { useEffect, useState } from 'react'
import { Header } from 'decentraland-ui'
import { Bid } from '../../Bid'
import { Props } from './BidList.types'
import './BidList.css'

const BidList = (props: Props) => {
  const { nft, bids, onFetchBids } = props

  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    if (!hasFetched && nft) {
      setHasFetched(true)
      onFetchBids(nft)
    }
  }, [hasFetched, onFetchBids, nft])

  // reset the flag if the nft changes
  useEffect(() => {
    if (nft) {
      setHasFetched(false)
    }
  }, [nft])

  return bids.length > 0 ? (
    <div className="BidList">
      <Header sub>Bids</Header>
      <div className="list">
        {bids.map(bid => (
          <Bid key={bid.id} bid={bid} isArchivable={false} hasImage={false} />
        ))}
      </div>
    </div>
  ) : null
}

export default React.memo(BidList)
