import { useMemo, memo } from 'react'

import { Link } from 'react-router-dom'
import { NFTCategory } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFT } from '../../../../modules/nft/types'
import { locations } from '../../../../modules/routing/locations'
import { Info } from '../../Info'
import { Props } from '../DetailsRow.types'
import styles from './Type.module.css'

export const Type = (props: Props) => {
  const { asset, owner } = props

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

  return categoryName ? (
    <Info title={t('global.type')}>
      <div className={styles.type}>
        {categoryName}
        {asset.category === NFTCategory.PARCEL && (asset as NFT).data.parcel?.estate ? (
          <>
            {' ('}
            <T
              id="asset_page.part_of_estate"
              values={{
                estate_name: (
                  <Link
                    title={(asset as NFT).data.parcel?.estate?.name ?? t('global.estate')}
                    to={locations.nft(owner, asset.data.parcel?.estate!.tokenId)}
                  >
                    {(asset as NFT).data.parcel?.estate?.name ?? t('global.estate')}
                  </Link>
                )
              }}
            />
            {')'}
          </>
        ) : null}
        {asset.category === NFTCategory.ESTATE ? ` (${asset.data.estate!.size})` : ''}
      </div>
    </Info>
  ) : null
}

export default memo(Type)
