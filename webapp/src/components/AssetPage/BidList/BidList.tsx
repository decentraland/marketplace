import React, { useEffect, useMemo, useState } from 'react'
import { Header } from 'decentraland-ui'
import { Props } from './BidList.types'
import { Bid } from '../../Bid'
import './BidList.css'

const BidList = (props: Props) => {
  const { nft, bids, onFetchBids } = props

  const [hasFetched, setHasFetched] = useState(false)

  // this is because when you change from one nft detail to another you would still see the previous nft bids
  const filteredBids = useMemo(
    () =>
      bids.filter(
        bid =>
          bid.contractAddress === nft.contractAddress &&
          bid.tokenId === nft.tokenId
      ),
    [nft, bids]
  )

  useEffect(() => {
    if (!hasFetched) {
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
        {filteredBids.map(bid => (
          <Bid key={bid.id} bid={bid} isArchivable={false} hasImage={false} />
        ))}
      </div>
    </div>
  ) : null
}

export default React.memo(BidList)
