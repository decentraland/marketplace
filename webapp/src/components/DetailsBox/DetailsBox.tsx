import { memo } from 'react'
import { Link } from 'react-router-dom'
import { NFTCategory } from '@dcl/schemas'
import classNames from 'classnames'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isNFT } from '../../modules/asset/utils'
import { locations } from '../../modules/routing/locations'
import { Box } from '../AssetBrowse/Box'
import { LinkedProfile } from '../LinkedProfile'
import { Availability, Expiration, Type } from './DetailsRow'
import { Info } from './Info'
import { Props } from './DetailsBox.types'
import styles from './DetailsBox.module.css'

export const DetailsBox = (props: Props) => {
  const { asset, order, rental, className } = props

  const owner = rental && rental.lessor ? rental.lessor : isNFT(asset) ? asset.owner : asset.creator
  const isPartOfEstate = asset.category === NFTCategory.PARCEL && asset.data.parcel?.estate

  return (
    <Box header={t('details_box.title')} className={classNames(className)}>
      <div className={styles.content}>
        <Type asset={asset} owner={owner} />
        <Info title={t('details_box.network')}>
          <span>{asset.network}</span>
        </Info>
        {isPartOfEstate && !!asset.data.parcel && isNFT(asset) && (
          <div className={styles.estateInfo}>
            <T
              id="asset_page.part_of_estate"
              values={{
                estate_name: (
                  <Link title={asset.data.parcel.estate!.name} to={locations.nft(asset.owner, asset.data.parcel.estate!.tokenId)}>
                    {asset.data.parcel.estate!.name}
                  </Link>
                )
              }}
            />
          </div>
        )}
        <Availability asset={asset} />
        <Expiration asset={asset} order={order} rental={rental} />
        {owner ? (
          <Info title={t('details_box.owner')}>
            <LinkedProfile hasPopup={true} address={owner} />
          </Info>
        ) : null}
      </div>
    </Box>
  )
}

export default memo(DetailsBox)
