import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'

import { builderUrl } from '../../../../lib/environment'
import { isOwnedBy } from '../../../../modules/asset/utils'
import { locations } from '../../../../modules/routing/locations'
import { VendorFactory } from '../../../../modules/vendor'
import styles from './NFTSaleActions.module.css'
import { Props } from './NFTSaleActions.types'
import { BuyNFTButtons } from '../BuyNFTButtons'

const NFTSaleActions = ({ bids, nft, order, wallet }: Props) => {
  const { vendor, contractAddress, tokenId, data } = nft

  const [showLeavingSiteModal, setShowLeavingSiteModal] = useState(false)

  const { bidService, orderService } = VendorFactory.build(nft.vendor)
  const isBiddable = bidService !== undefined

  const isOwner = isOwnedBy(nft, wallet)
  const isENSName = !!data.ens

  const canSell = orderService.canSell()
  const notLoggedOrHasAlreadyBidsOnNft =
    !wallet || !bids.some(bid => bid.bidder === wallet.address)
  const canBid = !isOwner && isBiddable && notLoggedOrHasAlreadyBidsOnNft

  // TODO (buy nfts with card): remove irrelevant actions
  return (
    <>
      {order ? (
        isOwner && canSell ? (
          <>
            <Button
              as={Link}
              to={locations.sell(contractAddress, tokenId)}
              primary
              fluid
            >
              {t('asset_page.actions.update')}
            </Button>
            <Button
              as={Link}
              to={locations.cancel(contractAddress, tokenId)}
              fluid
            >
              {t('asset_page.actions.cancel_sale')}
            </Button>
          </>
        ) : !isOwner ? (
          <>
            <BuyNFTButtons asset={nft} />
            {canBid ? (
              <Button
                as={Link}
                className={styles.bid}
                to={locations.bid(contractAddress, tokenId)}
                fluid
              >
                {t('asset_page.actions.bid')}
              </Button>
            ) : null}
          </>
        ) : (
          <Button onClick={() => setShowLeavingSiteModal(true)} primary fluid>
            {t('asset_page.actions.see_listing')}
          </Button>
        )
      ) : isOwner && canSell ? (
        <Button
          as={Link}
          to={locations.sell(contractAddress, tokenId)}
          primary
          fluid
        >
          {t('asset_page.actions.sell')}
        </Button>
      ) : isOwner && !canSell ? (
        <Button onClick={() => setShowLeavingSiteModal(true)} primary fluid>
          {t('asset_page.actions.sell')}
        </Button>
      ) : canBid ? (
        <Button
          as={Link}
          to={locations.bid(contractAddress, tokenId)}
          primary
          fluid
        >
          {t('asset_page.actions.bid')}
        </Button>
      ) : null}
      {isOwner && !order ? (
        <Button
          as={Link}
          to={locations.transfer(contractAddress, tokenId)}
          fluid
        >
          {t('asset_page.actions.transfer')}
        </Button>
      ) : null}
      {isOwner && isENSName && (
        <Button as="a" href={`${builderUrl}/names`} fluid>
          {t('asset_page.actions.manage')}
        </Button>
      )}

      {/* TODO (buy nfts with card): move this to a new component and use openModal */}
      <Modal
        className="LeavingSiteModal"
        size="small"
        open={showLeavingSiteModal}
        onClose={() => setShowLeavingSiteModal(false)}
      >
        <Modal.Header>
          {t('asset_page.actions.leaving_decentraland')}
        </Modal.Header>
        <Modal.Content>
          <p>
            <T
              id="asset_page.actions.leaving_decentraland_description"
              values={{
                vendor: t(`vendors.${vendor}`),
                vendor_link: (
                  <a href={nft.url} target="_blank" rel="noopener noreferrer">
                    {nft.url}
                  </a>
                )
              }}
            />
            <br />
            <br />
            <small>
              <i>{t('asset_page.actions.leaving_decentraland_disclaimer')}</i>
            </small>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowLeavingSiteModal(false)}>
            {t('global.cancel')}
          </Button>
          <Button
            primary
            as="a"
            href={nft.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowLeavingSiteModal(false)}
          >
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default memo(NFTSaleActions)