import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { builderUrl } from '../../../../lib/environment'
import { isOwnedBy } from '../../../../modules/asset/utils'
import { AssetType } from '../../../../modules/asset/types'
import { locations } from '../../../../modules/routing/locations'
import { VendorFactory } from '../../../../modules/vendor'
import styles from './NFTSaleActions.module.css'
import { Props } from './NFTSaleActions.types'
import { BuyNFTButtons } from '../BuyNFTButtons'

const NFTSaleActions = ({ bids, nft, order, wallet, onLeavingSite }: Props) => {
  const { contractAddress, tokenId, data } = nft

  const { bidService, orderService } = VendorFactory.build(nft.vendor)
  const isBiddable = bidService !== undefined

  const isOwner = isOwnedBy(nft, wallet)
  const isENSName = !!data.ens

  const canSell = orderService.canSell()
  const notLoggedOrHasAlreadyBidsOnNft =
    !wallet || !bids.some(bid => bid.bidder === wallet.address)
  const canBid = !isOwner && isBiddable && notLoggedOrHasAlreadyBidsOnNft

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
            <BuyNFTButtons
              assetType={AssetType.ITEM}
              contractAddress={nft.contractAddress}
              network={nft.network}
              tokenId={nft.tokenId}
            />
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
          <Button onClick={() => onLeavingSite(nft)} primary fluid>
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
        <Button onClick={() => onLeavingSite(nft)} primary fluid>
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
    </>
  )
}

export default memo(NFTSaleActions)
