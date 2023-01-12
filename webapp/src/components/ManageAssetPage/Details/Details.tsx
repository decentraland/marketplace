import { useMemo, memo } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Link } from 'react-router-dom'
import { NFTCategory, Rarity } from '@dcl/schemas'
import classNames from 'classnames'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFT } from '../../../modules/nft/types'
import { locations } from '../../../modules/routing/locations'
import { isItem, isNFT } from '../../../modules/asset/utils'
import { Box } from '../../AssetBrowse/Box'
import { LinkedProfile } from '../../LinkedProfile'
import { Props } from './Details.types'
import { Info } from './Info'
import styles from './Details.module.css'

export const Details = (props: Props) => {
  const { asset, order, rental, className } = props

  const categoryName = useMemo(() => {
    switch (asset.category) {
      case NFTCategory.PARCEL:
        return t('global.parcel')
      case NFTCategory.ESTATE:
        return t('global.estate')
      default:
        return null
    }
  }, [asset])

  const owner =
    rental && rental.lessor
      ? rental.lessor
      : isNFT(asset)
      ? asset.owner
      : asset.creator

  return (
    <Box
      header={t('manage_asset_page.details.title')}
      className={classNames(className)}
    >
      <div className={styles.content}>
        {categoryName ? (
          <Info title={t('global.type')}>
            <div className={styles.type}>
              {categoryName}
              {asset.category === NFTCategory.PARCEL &&
              (asset as NFT).data.parcel?.estate ? (
                <>
                  {' ('}
                  <T
                    id="asset_page.part_of_estate"
                    values={{
                      estate_name: (
                        <Link
                          title={
                            (asset as NFT).data.parcel?.estate?.name ??
                            t('global.estate')
                          }
                          to={locations.nft(
                            owner,
                            asset.data.parcel?.estate!.tokenId
                          )}
                        >
                          {(asset as NFT).data.parcel?.estate?.name ??
                            t('global.estate')}
                        </Link>
                      )
                    }}
                  />
                  {')'}
                </>
              ) : null}
              {asset.category === NFTCategory.ESTATE
                ? ` (${asset.data.estate!.size})`
                : ''}
            </div>
          </Info>
        ) : null}
        <Info title={t('manage_asset_page.details.network')}>
          <span>{asset.network}</span>
        </Info>
        {isItem(asset) ? (
          <Info title={t('manage_asset_page.details.stock')}>
            {asset.available > 0 ? (
              <>
                {asset.available.toLocaleString()}
                <span className={styles.supply}>
                  /{Rarity.getMaxSupply(asset.rarity).toLocaleString()}
                </span>
              </>
            ) : (
              t('asset_page.sold_out')
            )}
          </Info>
        ) : null}
        {order ? (
          <Info title={t('manage_asset_page.details.order_expiration')}>
            <span>
              {formatDistanceToNow(order.expiresAt, {
                addSuffix: true
              })}
            </span>
          </Info>
        ) : null}
        {rental ? (
          <Info title={t('manage_asset_page.details.rental_expiration')}>
            <span>
              {formatDistanceToNow(rental.expiration, {
                addSuffix: true
              })}
            </span>
          </Info>
        ) : null}
        {owner ? (
          <Info title={t('manage_asset_page.details.owner')}>
            <LinkedProfile hasPopup={true} address={owner} />
          </Info>
        ) : null}
      </div>
    </Box>
  )
}

export default memo(Details)
