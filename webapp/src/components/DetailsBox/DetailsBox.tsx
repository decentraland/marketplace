import { memo } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isNFT } from '../../modules/asset/utils'
import { Box } from '../AssetBrowse/Box'
import { LinkedProfile } from '../LinkedProfile'
import { Props } from './DetailsBox.types'
import { Info } from './Info'
import styles from './DetailsBox.module.css'
import { Availability, Expiration, Type } from './DetailsRow'

export const DetailsBox = (props: Props) => {
  const { asset, order, rental, className } = props

  const owner =
    rental && rental.lessor
      ? rental.lessor
      : isNFT(asset)
      ? asset.owner
      : asset.creator

  return (
    <Box header={t('details_box.title')} className={classNames(className)}>
      <div className={styles.content}>
        <Type asset={asset} owner={owner} />
        <Info title={t('details_box.network')}>
          <span>{asset.network}</span>
        </Info>
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
