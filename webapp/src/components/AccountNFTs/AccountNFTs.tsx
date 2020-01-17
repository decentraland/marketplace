import React, { useEffect } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Loader } from 'decentraland-ui'

import { NFTCard } from '../NFTCard'
import { Props } from './AccountNFTs.types'
import './AccountNFTs.css'

const AccountNFTs = (props: Props) => {
  const { address, account, nfts, onFetchAccount, isLoading } = props

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
          {account.nftIds.map(nftId => (
            <NFTCard key={nftId} nft={nfts[nftId]} />
          ))}
        </Card.Group>
      ) : (
        <div className="empty">
          {t('account_nfts.empty_account', { address })}
        </div>
      )}
    </div>
  )
}

export default React.memo(AccountNFTs)
