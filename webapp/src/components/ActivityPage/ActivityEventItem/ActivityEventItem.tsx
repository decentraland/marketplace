import React from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { Profile } from 'decentraland-dapps/dist/containers'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon, Loader } from 'decentraland-ui'
import { formatDistanceToNow } from '../../../lib/date'
import { ActivityEvent, ActivityEventType } from '../../../modules/activity/types'
import { Asset, AssetType } from '../../../modules/asset/types'
import { getAssetName, getAssetUrl } from '../../../modules/asset/utils'
import { locations } from '../../../modules/routing/locations'
import { AssetImage } from '../../AssetImage'
import { AssetProvider } from '../../AssetProvider'
import { Column } from '../../Layout/Column'
import { Row } from '../../Layout/Row'
import { Mana } from '../../Mana'
import { Props } from './ActivityEventItem.types'

const formatPrice = (priceInWei?: string) => {
  if (!priceInWei) return '0'
  try {
    return Number(ethers.utils.formatEther(priceInWei)).toLocaleString()
  } catch {
    return '0'
  }
}

const getAssetSelector = (event: ActivityEvent): { type: AssetType; tokenId: string } | null => {
  if (event.itemId && event.contractAddress) return { type: AssetType.ITEM, tokenId: event.itemId }
  if (event.tokenId && event.contractAddress) return { type: AssetType.NFT, tokenId: event.tokenId }
  return null
}

const renderAssetLink = (event: ActivityEvent, asset: Asset | null | undefined): React.ReactNode => {
  if (!event.contractAddress) return ''
  const name = asset ? getAssetName(asset) : '…'
  if (event.itemId) return <Link to={locations.item(event.contractAddress, event.itemId)}>{name}</Link>
  if (event.tokenId) return <Link to={locations.nft(event.contractAddress, event.tokenId)}>{name}</Link>
  return name
}

const renderCounterparty = (address?: string): React.ReactNode => {
  if (!address) return ''
  return (
    <Link to={locations.account(address)}>
      <Profile address={address} />
    </Link>
  )
}

const eventTranslationKey: Record<ActivityEventType, string> = {
  [ActivityEventType.SALE_BUYER]: 'activity_page.event.sale_buyer',
  [ActivityEventType.SALE_SELLER]: 'activity_page.event.sale_seller',
  [ActivityEventType.BID_PLACED]: 'activity_page.event.bid_placed',
  [ActivityEventType.BID_RECEIVED]: 'activity_page.event.bid_received',
  [ActivityEventType.ORDER_CREATED]: 'activity_page.event.order_created',
  [ActivityEventType.ORDER_FILLED]: 'activity_page.event.order_filled',
  [ActivityEventType.TRADE_CREATED]: 'activity_page.event.trade_created'
}

const ActivityEventItem = (props: Props) => {
  const { event } = props
  const selector = getAssetSelector(event)
  const priceLabel = (
    <Mana showTooltip network={event.network} inline>
      {formatPrice(event.price)}
    </Mana>
  )

  const body = (asset: Asset | null | undefined) => (
    <Row className="TransactionDetail">
      <Column align="left" grow={true}>
        <div className="image">
          {asset === null ? (
            <Loader active size="small" />
          ) : asset ? (
            <Link to={getAssetUrl(asset)}>
              <AssetImage asset={asset} isSmall />
            </Link>
          ) : (
            <Mana showTooltip network={event.network} />
          )}
        </div>
        <div className="text">
          <div className="description">
            <T
              id={eventTranslationKey[event.type]}
              values={{
                name: renderAssetLink(event, asset),
                price: priceLabel,
                counterparty: renderCounterparty(event.counterparty)
              }}
            />
          </div>
          <div className="timestamp">{formatDistanceToNow(event.timestamp)}.</div>
        </div>
      </Column>
      <Column align="right">
        <span className="status confirmed">
          <div className="description">{t('activity_page.event.status.confirmed')}</div>
          <Icon name="check" />
        </span>
      </Column>
    </Row>
  )

  if (!selector) {
    return body(undefined)
  }

  return (
    <AssetProvider type={selector.type} contractAddress={event.contractAddress} tokenId={selector.tokenId}>
      {asset => body(asset)}
    </AssetProvider>
  )
}

export default React.memo(ActivityEventItem)
