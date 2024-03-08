import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import { Loader, Stats, Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { addressEquals } from '../../modules/wallet/utils'
import { AssetType } from '../../modules/asset/types'
import { AssetProvider } from '../AssetProvider'
import { LinkedProfile } from '../LinkedProfile'
import { AssetImage } from '../AssetImage'
import { Mana } from '../Mana'
import { AcceptButton } from './AcceptButton'
import { WarningMessage } from './WarningMessage'
import { formatWeiMANA } from '../../lib/mana'
import { formatDistanceToNow } from '../../lib/date'
import { Props } from './Bid.types'
import { ConfirmInputValueModal } from '../ConfirmInputValueModal'
import { getAssetName } from '../../modules/asset/utils'
import './Bid.css'

const Bid = (props: Props) => {
  const { bid, wallet, archivedBidIds, onAccept, onArchive, onUnarchive, onCancel, onUpdate, isArchivable, hasImage, isAcceptingBid } =
    props

  const isArchived = archivedBidIds.includes(bid.id)
  const isBidder = !!wallet && addressEquals(wallet.address, bid.bidder)
  const isSeller = !!wallet && addressEquals(wallet.address, bid.seller)

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const handleConfirm = useCallback(() => onAccept(bid), [bid, onAccept])
  const handleAccept = () => setShowConfirmationModal(true)

  return (
    <>
      <div className="Bid">
        <div className="bid-row">
          {hasImage ? (
            <div className="image">
              <AssetProvider type={AssetType.NFT} contractAddress={bid.contractAddress} tokenId={bid.tokenId}>
                {(nft, _order, _rental, isLoading) => (
                  <>
                    {!nft && isLoading ? <Loader active /> : null}
                    {nft ? (
                      <Link to={locations.nft(bid.contractAddress, bid.tokenId)}>
                        <AssetImage asset={nft} />{' '}
                      </Link>
                    ) : null}
                  </>
                )}
              </AssetProvider>
            </div>
          ) : null}
          <div className="wrapper">
            <div className="info">
              <Stats className="from" title={t('bid.from')}>
                <LinkedProfile address={bid.bidder} />
              </Stats>
              <Stats className="price" title={t('bid.price')}>
                <Mana showTooltip network={bid.network}>
                  {formatWeiMANA(bid.price)}
                </Mana>
              </Stats>
              <Stats title={t('bid.time_left')}>{formatDistanceToNow(+bid.expiresAt)}</Stats>
            </div>
            {isBidder || isSeller ? (
              <div className="actions">
                {isBidder ? (
                  <>
                    <Button primary onClick={() => onUpdate(bid)}>
                      {t('global.update')}
                    </Button>
                    <Button onClick={() => onCancel(bid)}>{t('global.cancel')}</Button>
                  </>
                ) : null}
                {isSeller ? (
                  <>
                    <AssetProvider type={AssetType.NFT} contractAddress={bid.contractAddress} tokenId={bid.tokenId}>
                      {(nft, _order, rental) => (
                        <AcceptButton userAddress={wallet.address} nft={nft} rental={rental} bid={bid} onClick={handleAccept} />
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
          <AssetProvider type={AssetType.NFT} contractAddress={bid.contractAddress} tokenId={bid.tokenId}>
            {nft => <WarningMessage nft={nft} bid={bid} />}
          </AssetProvider>
        ) : null}
      </div>
      {showConfirmationModal ? (
        <AssetProvider type={AssetType.NFT} contractAddress={bid.contractAddress} tokenId={bid.tokenId}>
          {nft =>
            nft && (
              <ConfirmInputValueModal
                open={showConfirmationModal}
                headerTitle={t('bid_page.confirm.title')}
                content={
                  <>
                    <T
                      id="bid_page.confirm.accept_bid_line_one"
                      values={{
                        name: <b>{getAssetName(nft)}</b>,
                        amount: (
                          <Mana showTooltip network={nft.network} inline>
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
                network={nft.network}
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

export default React.memo(Bid)
