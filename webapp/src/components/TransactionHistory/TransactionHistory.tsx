import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Responsive, Mana } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../modules/routing/locations'
import { Order } from '../../modules/order/types'
import { formatMANA } from '../../lib/mana'
import { nftAPI } from '../../lib/api/nft'
import { shortenAddress } from '../../modules/wallet/utils'
import { Owner } from '../NFTPage/Owner'

// import AddressBlock from '../AddressBlock'
// import BlockDate from '../BlockDate'
// import Mana from '../Mana'
// import {
//   publicationToListing,
//   bidToListing,
//   sortListings,
//   LISTING_STATUS,
//   LISTING_SORT_BY
// } from 'shared/listing'
// import { findAssetPublications } from 'shared/publication'
// import { distanceInWordsToNow, shortenAddress } from 'lib/utils'
import { Props } from './TransactionHistory.types'

import './TransactionHistory.css'

const TransactionHistory = (props: Props) => {
  const { nft } = props

  const [orders, setOrders] = useState([] as Order[])
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    if (nft) {
      setIsLoading(true)
      nftAPI.fetchOrders(nft.id).then(orders => {
        setIsLoading(false)
        setOrders(orders)
      })
    }
  }, [setIsLoading, setOrders])

  if (isLoading) {
    return null
  }

  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column>
          <Grid className="TransactionHistory asset-detail-row" columns="equal">
            <Grid.Row>
              <Grid.Column>
                <h3>{t('detail.history.title')}</h3>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="transaction-history-header">
              <Grid.Column>{t('detail.price')}</Grid.Column>
              <Grid.Column>{t('detail.history.when')}</Grid.Column>
              <Responsive
                as={Grid.Column}
                minWidth={Responsive.onlyTablet.minWidth}
              >
                {t('detail.history.from')}
              </Responsive>
              <Responsive
                as={Grid.Column}
                minWidth={Responsive.onlyTablet.minWidth}
              >
                {t('detail.history.to')}
              </Responsive>
            </Grid.Row>

            {orders.map(order => (
              <Grid.Row key={order.id} className="transaction-history-entry">
                <Grid.Column>
                  <Mana inline>{formatMANA(order.price)}</Mana>
                </Grid.Column>
                <Grid.Column></Grid.Column>
                <Responsive
                  as={Grid.Column}
                  minWidth={Responsive.onlyTablet.minWidth}
                >
                  <TransactionAddress nft={nft} address={order.owner} />
                </Responsive>
                <Responsive
                  as={Grid.Column}
                  minWidth={Responsive.onlyTablet.minWidth}
                >
                  <TransactionAddress nft={nft} address={order.buyer} />
                </Responsive>
              </Grid.Row>
            ))}
          </Grid>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default React.memo(TransactionHistory)

const TransactionAddress = (props: any) => {
  const { address, nft } = props

  return (
    <div className="address-wrapper" title={address}>
      <Owner nft={nft} />
      <Link to={locations.account(address)}>
        &nbsp;
        <span className="short-address">{shortenAddress(address)}</span>
      </Link>
    </div>
  )
}

// export default class AssetTransactionHistory extends React.PureComponent {
//   componentWillMount() {
//     this.props.onFetchAssetTransactionHistory()
//   }

//   getAssetListings() {
//     const { asset, publications, bids } = this.props
//     const assetPublications = findAssetPublications(
//       publications,
//       asset,
//       LISTING_STATUS.sold
//     )

//     const listingPublications = assetPublications.map(publicationToListing)
//     const listingBids = bids.map(bidToListing)

//     return sortListings(
//       listingPublications.concat(listingBids),
//       LISTING_SORT_BY.BLOCK_UPDATED
//     )
//   }

//   hasAuctionData() {
//     const { asset } = this.props
//     return asset.auction_price != null && asset.auction_owner != null
//   }

//   renderAddress(address) {
//     return (
//       <div className="address-wrapper" title={address}>
//         <Link to={locations.profilePageDefault(address)}>
//           <AddressBlock
//             address={address}
//             scale={4}
//             hasTooltip={false}
//             hasLink={false}
//           />
//           &nbsp;
//           <span className="short-address">{shortenAddress(address)}</span>
//         </Link>
//       </div>
//     )
//   }

//   render() {
//     const { asset } = this.props
//     const assetListings = this.getAssetListings()

//     if (!this.hasAuctionData() && assetListings.length === 0) {
//       return null
//     }

//     return (
//       <Grid stackable>
//         <Grid.Row>
//           <Grid.Column>
//             <Grid
//               className="AssetTransactionHistory asset-detail-row"
//               columns="equal"
//             >
//               <Grid.Row>
//                 <Grid.Column>
//                   <h3>{t('asset_detail.history.title')}</h3>
//                 </Grid.Column>
//               </Grid.Row>
//               <Grid.Row className="transaction-history-header">
//                 <Grid.Column>{t('global.price')}</Grid.Column>
//                 <Grid.Column>{t('asset_detail.history.when')}</Grid.Column>
//                 <Responsive
//                   as={Grid.Column}
//                   minWidth={Responsive.onlyTablet.minWidth}
//                 >
//                   {t('global.from')}
//                 </Responsive>
//                 <Responsive
//                   as={Grid.Column}
//                   minWidth={Responsive.onlyTablet.minWidth}
//                 >
//                   {t('asset_detail.history.to')}
//                 </Responsive>
//               </Grid.Row>

//               {assetListings.map(listing => (
//                 <Grid.Row
//                   key={listing.id}
//                   className="transaction-history-entry"
//                 >
//                   <Grid.Column>
//                     <Mana amount={listing.price} />
//                   </Grid.Column>
//                   <Grid.Column>
//                     <BlockDate
//                       blockNumber={listing.block_number}
//                       blockTime={
//                         listing.block_time_updated_at ||
//                         listing.block_time_created_at
//                       }
//                     />
//                   </Grid.Column>
//                   <Responsive
//                     as={Grid.Column}
//                     minWidth={Responsive.onlyTablet.minWidth}
//                   >
//                     {this.renderAddress(listing.from)}
//                   </Responsive>
//                   <Responsive
//                     as={Grid.Column}
//                     minWidth={Responsive.onlyTablet.minWidth}
//                   >
//                     {this.renderAddress(listing.to)}
//                   </Responsive>
//                 </Grid.Row>
//               ))}

//               {this.hasAuctionData() ? (
//                 <Grid.Row className="transaction-history-entry">
//                   <Grid.Column>
//                     <Mana amount={asset.auction_price} />
//                   </Grid.Column>
//                   <Grid.Column>
//                     {distanceInWordsToNow(
//                       parseInt(asset.auction_timestamp, 10)
//                     )}
//                   </Grid.Column>
//                   <Responsive
//                     as={Grid.Column}
//                     minWidth={Responsive.onlyTablet.minWidth}
//                   >
//                     {t('asset_detail.history.auction')}
//                   </Responsive>
//                   <Responsive
//                     as={Grid.Column}
//                     minWidth={Responsive.onlyTablet.minWidth}
//                   >
//                     {this.renderAddress(asset.auction_owner)}
//                   </Responsive>
//                 </Grid.Row>
//               ) : null}
//             </Grid>
//           </Grid.Column>
//         </Grid.Row>
//       </Grid>
//     )
//   }
// }
