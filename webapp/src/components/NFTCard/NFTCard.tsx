import React, { useCallback } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card, Mana } from 'decentraland-ui'

import { formatMANA } from '../../lib/mana'
import { locations } from '../../modules/routing/locations'
import { getExpiresAt } from '../../modules/order/utils'
import { getNFTName } from '../../modules/nft/utils'
import { NFTImage } from '../NFTImage'
import { ParcelTags } from './ParcelTags'
import { EstateTags } from './EstateTags'
import { WearableTags } from './WearableTags'
import { Props } from './NFTCard.types'
import './NFTCard.css'

const NFTCard = (props: Props) => {
  const { nft, order, onNavigate } = props

  const title = getNFTName(nft)

  const handleClick = useCallback(
    () => onNavigate(locations.ntf(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )

  return (
    <Card className="NFTCard" link onClick={handleClick}>
      <NFTImage nft={nft} />
      <Card.Content>
        <Card.Header>
          <div className="title">{title}</div>{' '}
          {order ? <Mana inline>{formatMANA(order.price)}</Mana> : null}
        </Card.Header>
        {order ? (
          <Card.Meta>
            {t('nft_card.expires_at', { date: getExpiresAt(order) })}
          </Card.Meta>
        ) : null}
        {nft.parcel ? <ParcelTags nft={nft} /> : null}
        {nft.estate ? <EstateTags nft={nft} /> : null}
        {nft.wearable ? <WearableTags nft={nft} /> : null}
      </Card.Content>
    </Card>
  )
}

export default React.memo(NFTCard)
