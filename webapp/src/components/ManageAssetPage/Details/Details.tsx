import { useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import { NFTCategory } from '@dcl/schemas'
import classNames from 'classnames'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFT } from '../../../modules/nft/types'
import { locations } from '../../../modules/routing/locations'
import { Box } from '../../AssetBrowse/Box'
import { LinkedProfile } from '../../LinkedProfile'
import { Props } from './Details.types'
import styles from './Details.module.css'

const Info = ({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className={styles.detail}>
    <div className={styles.detailTitle}>{title}</div>
    <div className={styles.detailContent}>{children}</div>
  </div>
)

export const Details = (props: Props) => {
  const { asset, rental, className } = props

  const categoryName = useMemo(() => {
    switch (asset.category) {
      case NFTCategory.PARCEL:
        return t('global.parcel')
      case NFTCategory.ESTATE:
        return t('global.estate')
      default:
        return t('global.nft')
    }
  }, [asset])

  const owner = rental && rental.lessor ? rental.lessor : (asset as NFT).owner!

  return (
    <Box
      header={t('manage_asset_page.details.title')}
      className={classNames(className)}
    >
      <div className={styles.content}>
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
        <Info title={t('manage_asset_page.details.network')}>
          <span>{asset.network}</span>
        </Info>
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
