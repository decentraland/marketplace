import React from 'react'

import { VendorName } from '../../../modules/vendor/types'
import { ENSDetail } from '../../NFTPage/ENSDetail'
import { EstateDetail } from '../../NFTPage/EstateDetail'
import { ParcelDetail } from '../../NFTPage/ParcelDetail'
import { PictureFrameDetail } from '../../NFTPage/PictureFrameDetail'
import { WearableDetail } from '../../NFTPage/WearableDetail'
import { Props } from './NFTDetail.types'

const NFTDetail = (props: Props) => {
  const { nft } = props
  const { parcel, estate, wearable, ens } = nft.data as any
  return (
    <>
      {parcel ? <ParcelDetail nft={nft} /> : null}
      {estate ? <EstateDetail nft={nft} /> : null}
      {wearable ? <WearableDetail nft={nft} /> : null}
      {ens ? <ENSDetail nft={nft} /> : null}
      {nft.vendor !== VendorName.DECENTRALAND ? (
        <PictureFrameDetail nft={nft} />
      ) : null}
    </>
  )
}

export default React.memo(NFTDetail)
