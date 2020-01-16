import React, { useEffect } from 'react'
import { Card, Loader } from 'decentraland-ui'

import OrderCard from '../MarketPage/OrderCard/OrderCard'
import { Props } from './AccountNFTs.types'

const AccountNFTs = (props: Props) => {
  const { address, account, nfts, orders, onFetchAccount, isLoading } = props

  useEffect(() => {
    onFetchAccount({
      variables: {
        address: address
      }
    })
  }, [address, onFetchAccount])

  return (
    <div className="AccountNFTs">
      {isLoading ? (
        <Loader size="massive" active />
      ) : account ? (
        <Card.Group>
          {account.nftIds.map(nftId => {
            const nft = nfts[nftId]
            const order =
              orders[
                nft.activeOrderId ||
                  '0x822aa01a2fa61f734069e242a9719a28d1a53bb63b9aaace506aa9ea7d80dd59'
              ]
            return <OrderCard key={nftId} nft={nft} order={order} />
          })}
        </Card.Group>
      ) : (
        <div>No account for address {address}</div>
      )}
    </div>
  )
}

export default React.memo(AccountNFTs)
