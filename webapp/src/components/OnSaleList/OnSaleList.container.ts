import { Network, NFTCategory, Rarity } from '@dcl/schemas'
import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import OnSaleList from './OnSaleList'
import { MapStateProps } from './OnSaleList.types'

const mapState = (_state: RootState): MapStateProps => {
  return {
    items: [
      {
        title: 'Maraca Earrings',
        type: NFTCategory.WEARABLE,
        saleType: 'secondary',
        price: '1000000000000000000000',
        rarity: Rarity.RARE,
        network: Network.MATIC,
        src:
          'https://peer.decentraland.zone/lambdas/collections/contents/urn:decentraland:mumbai:collections-v2:0x5ac1906ecc1bd28af696ccf97e0d1c0511505718:0/thumbnail'
      },
      {
        title: 'Best Maraca Earings',
        subtitle: 'Season 1',
        type: NFTCategory.WEARABLE,
        saleType: 'primary',
        price: '1000000000000000000000',
        rarity: Rarity.LEGENDARY,
        network: Network.ETHEREUM,
        src:
          'https://peer.decentraland.zone/lambdas/collections/contents/urn:decentraland:mumbai:collections-v2:0x5ac1906ecc1bd28af696ccf97e0d1c0511505718:0/thumbnail'
      },
      {
        title: 'NandoKorea',
        type: NFTCategory.ENS,
        saleType: 'secondary',
        price: '1000000000000000000000',
        network: Network.ETHEREUM
      },
      {
        title: 'Parcel',
        subtitle: '24/24',
        type: NFTCategory.PARCEL,
        saleType: 'secondary',
        price: '1000000000000000000000',
        network: Network.ETHEREUM
      },
      {
        title: 'Dream City',
        subtitle: '9 Parcels',
        type: NFTCategory.ESTATE,
        saleType: 'secondary',
        price: '1000000000000000000000',
        network: Network.ETHEREUM
      }
    ]
  }
}

export default connect(mapState)(OnSaleList)
