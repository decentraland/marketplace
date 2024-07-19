import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ethers } from 'ethers'
import { Contract } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName, getContract as getDCLContract } from 'decentraland-transactions'
import { Loader, Stats, Button } from 'decentraland-ui'
import { formatDistanceToNow } from '../../lib/date'
import { formatWeiMANA } from '../../lib/mana'
import { AssetType } from '../../modules/asset/types'
import { getAssetName } from '../../modules/asset/utils'
import { isBidTrade } from '../../modules/bid/utils'
import { locations } from '../../modules/routing/locations'
import { addressEquals } from '../../modules/wallet/utils'
import { AssetImage } from '../AssetImage'
import { AssetProvider } from '../AssetProvider'
import { ConfirmInputValueModal } from '../ConfirmInputValueModal'
import { LinkedProfile } from '../LinkedProfile'
import { Mana } from '../Mana'
import { AcceptButton } from './AcceptButton'
import { fetchContractName } from './utils'
import { WarningMessage } from './WarningMessage'
import { Props } from './Bid.types'
import './Bid.css'

const Bid = (props: Props) => {
  const {
    bid,
    wallet,
    archivedBidIds,
    isBidsOffchainEnabled,
    onAuthorizedAction,
    onAccept,
    onArchive,
    onUnarchive,
    onCancel,
    getContract,
    isArchivable,
    hasImage,
    isAcceptingBid
  } = props
  const history = useHistory()
  const [targetContractLabel, setTargetContractLabel] = useState<string | null>('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const isArchived = archivedBidIds.includes(bid.id)
  const isBidder = !!wallet && addressEquals(wallet.address, bid.bidder)
  const isSeller = !!wallet && addressEquals(wallet.address, bid.seller)
  const isNftBid = 'tokenId' in bid
  const assetType = isNftBid ? AssetType.NFT : AssetType.ITEM
  const tokenId = isNftBid ? bid.tokenId : bid.itemId

  useEffect(() => {
    let cancel = false
    if (isBidsOffchainEnabled) {
      fetchContractName(bid.contractAddress, bid.chainId)
        .then(name => {
          if (!cancel) {
            setTargetContractLabel(name)
          }
        })
        .catch(() => console.error('Could not fetch contract name'))
    }
    return () => {
      cancel = true
    }
  }, [isBidsOffchainEnabled, bid])

  const handleConfirm = useCallback(() => {
    if (isBidsOffchainEnabled && 'tradeId' in bid) {
      const assetContract = getContract({ address: bid.contractAddress, chainId: bid.chainId })
      const offchainMarketplaceContract = getDCLContract(ContractName.OffChainMarketplace, bid.chainId)

      if ('tokenId' in bid) {
        onAuthorizedAction({
          targetContractName: ContractName.ERC721,
          targetContractLabel: targetContractLabel || assetContract?.label || assetContract?.name,
          authorizedAddress: offchainMarketplaceContract.address,
          targetContract: assetContract as Contract,
          authorizationType: AuthorizationType.APPROVAL,
          authorizedContractLabel: offchainMarketplaceContract.name,
          tokenId: bid.tokenId,
          onAuthorized: () => onAccept(bid)
        })
      } else {
        console.error('Implement bid acceptance for items')
      }
    } else {
      onAccept(bid)
    }
  }, [bid, targetContractLabel, onAccept])

  const handleAccept = () => setShowConfirmationModal(true)

  return (
    <>
      <div className="Bid">
        <div className="bid-row">
          {hasImage ? (
            <div className="image">
              <AssetProvider type={assetType} contractAddress={bid.contractAddress} tokenId={tokenId}>
                {(asset, _order, _rental, isLoading) => (
                  <>
                    {!asset && isLoading ? <Loader active /> : null}
                    {asset ? (
                      <Link
                        to={isNftBid ? locations.nft(bid.contractAddress, bid.tokenId) : locations.item(bid.contractAddress, bid.itemId)}
                      >
                        <AssetImage asset={asset} />{' '}
                      </Link>
                    ) : null}
                  </>
                )}
              </AssetProvider>
            </div>
          ) : null}
          <div className="wrapper">
            <Stats className="from" title={t('bid.from')}>
              <LinkedProfile address={bid.bidder} />
            </Stats>
            <Stats className="price" title={t('bid.price')}>
              <Mana showTooltip network={bid.network}>
                {formatWeiMANA(bid.price)}
              </Mana>
            </Stats>
            <Stats title={t('bid.time_left')}>{formatDistanceToNow(+bid.expiresAt)}</Stats>
            {isBidder || isSeller ? (
              <div className="actions">
                {isBidder ? (
                  <>
                    {!isBidTrade(bid) && (
                      <Button primary onClick={() => history.push(locations.bid(bid.contractAddress, bid.tokenId))}>
                        {t('global.update')}
                      </Button>
                    )}
                    <Button onClick={() => onCancel(bid)}>{t('global.cancel')}</Button>
                  </>
                ) : null}
                {isSeller ? (
                  <>
                    <AssetProvider type={assetType} contractAddress={bid.contractAddress} tokenId={tokenId}>
                      {(asset, _order, rental) => (
                        <AcceptButton userAddress={wallet.address} asset={asset} rental={rental} bid={bid} onClick={handleAccept} />
                      )}
                    </AssetProvider>

                    {isArchivable ? (
                      !isArchived ? (
                        <Button onClick={() => onArchive(bid)}>{t('my_bids_page.archive')}</Button>
                      ) : (
                        <Button onClick={() => onUnarchive(bid)}>{t('my_bids_page.unarchive')}</Button>
                      )
                    ) : null}
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        {isBidder ? (
          <AssetProvider type={assetType} contractAddress={bid.contractAddress} tokenId={tokenId}>
            {asset => <WarningMessage asset={asset} bid={bid} />}
          </AssetProvider>
        ) : null}
      </div>
      {showConfirmationModal ? (
        <AssetProvider type={assetType} contractAddress={bid.contractAddress} tokenId={tokenId}>
          {asset =>
            asset && (
              <ConfirmInputValueModal
                open={showConfirmationModal}
                headerTitle={t('bid_page.confirm.title')}
                content={
                  <>
                    <T
                      id="bid_page.confirm.accept_bid_line_one"
                      values={{
                        name: <b>{getAssetName(asset)}</b>,
                        amount: (
                          <Mana showTooltip network={asset.network} inline>
                            {formatWeiMANA(bid.price)}
                          </Mana>
                        )
                      }}
                    />
                    <br />
                    <T id="bid_page.confirm.accept_bid_line_two" />
                  </>
                }
                onConfirm={handleConfirm}
                valueToConfirm={ethers.utils.formatEther(bid.price)}
                network={asset.network}
                onCancel={() => setShowConfirmationModal(false)}
                loading={isAcceptingBid}
                disabled={isAcceptingBid}
              />
            )
          }
        </AssetProvider>
      ) : null}
    </>
  )
}

Bid.defaultProps = {
  isArchivable: true,
  hasImage: true
}

export default withAuthorizedAction(React.memo(Bid), AuthorizedAction.BID, {
  confirm_transaction: {
    title: 'accept_bid.authorization.confirm_transaction.title'
  },
  title: 'accept_bid.authorization.title'
})
