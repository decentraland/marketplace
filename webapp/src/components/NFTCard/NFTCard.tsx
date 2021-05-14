import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'
import { Card, Mana } from 'decentraland-ui'

import { formatMANA } from '../../lib/mana'
import { formatDistanceToNow } from '../../lib/date'
import { locations } from '../../modules/routing/locations'
import { getNFTName } from '../../modules/nft/utils'
import { NFT } from '../../modules/nft/types'
import { VendorName } from '../../modules/vendor/types'
import { NFTImage } from '../NFTImage'
import { ParcelTags } from './ParcelTags'
import { EstateTags } from './EstateTags'
import { WearableTags } from './WearableTags'
import { ENSTags } from './ENSTags'
import { Props } from './NFTCard.types'
import './NFTCard.css'

const NFTCard = (props: Props) => {
  const { nft, order } = props

  const title = getNFTName(nft)
  const { parcel, estate, wearable, ens } = (nft as NFT<
    VendorName.DECENTRALAND
  >).data

  return (
    <Card
      className="NFTCard"
      link
      as={Link}
      to={locations.nft(nft.contractAddress, nft.tokenId)}
    >
      <NFTImage nft={nft} showMonospace />
      <Card.Content>
        <Card.Header>
          <div className="title">{title}</div>{' '}
          {order ? <Mana inline>{formatMANA(order.price)}</Mana> : null}
        </Card.Header>
        {order && order.expiresAt ? (
          <Card.Meta>
            {t('nft_card.expires_at', {
              date: formatDistanceToNow(+order.expiresAt, {
                addSuffix: true
              })
            })}
          </Card.Meta>
        ) : null}
        {parcel ? <ParcelTags nft={nft} /> : null}
        {estate ? <EstateTags nft={nft} /> : null}
        {wearable ? <WearableTags nft={nft} /> : null}
        {ens ? <ENSTags nft={nft} /> : null}
      </Card.Content>
    </Card>
  )
}

export default React.memo(NFTCard)
