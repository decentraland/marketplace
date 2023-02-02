import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { isOwnedBy } from '../../../modules/asset/utils'
import { locations } from '../../../modules/routing/locations'
import { AssetType } from '../../../modules/asset/types'
import { VendorFactory } from '../../../modules/vendor'
import { Props } from './Actions.types'
import styles from './Actions.module.css'
import { builderUrl } from '../../../lib/environment'

const Actions = (props: Props) => {
  const { wallet, nft, order, bids, onLeavingSite } = props
  const { contractAddress, tokenId, data } = nft

  const { bidService, orderService } = VendorFactory.build(nft.vendor)
  const isBiddable = bidService !== undefined

  const isOwner = isOwnedBy(nft, wallet)
  const isENSName = !!data.ens

  const canSell = orderService.canSell()
  const canBid =
    !isOwner &&
    isBiddable &&
    (!wallet || !bids.some(bid => bid.bidder === wallet.address))

  return (
    <div className={styles.container}>
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
            <Button
              as={Link}
              to={locations.buy(AssetType.NFT, contractAddress, tokenId)}
              primary
              fluid
            >
              {t('asset_page.actions.buy')}
            </Button>
            {canBid ? (
              <Button
                as={Link}
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
    </div>
  )
}

export default React.memo(Actions)
