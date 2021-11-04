import React from 'react'
import { Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from '../../Mana'
import { formatMANA } from '../../../lib/mana'
import { Props } from './OnSaleListElement.types'
import { NFTCategory } from '@dcl/schemas'

import styles from './OnSaleListElement.module.css'
import { AssetImage } from '../../AssetImage'

const OnSaleListElement = ({ nft, item, order }: Props) => {
  const category = item?.category || nft!.category

  let title = ''

  switch (category) {
    case NFTCategory.WEARABLE:
      title = item?.name || nft!.name
      break
    case NFTCategory.ESTATE:
    case NFTCategory.ENS:
      title = nft!.name
      break
    case NFTCategory.PARCEL:
      title = t(`global.parcel`)
  }

  let subtitle: string | undefined

  switch (category) {
    case NFTCategory.ESTATE:
      subtitle = t('global.parcel_count', {
        count: nft!.data.estate!.parcels.length
      })
      break
    case NFTCategory.PARCEL:
      const { x, y } = nft!.data.parcel!
      subtitle = `${x}/${y}`
  }

  return (
    <Table.Row>
      <Table.Cell>
        <div className={styles['first-cell']}>
          <div className={styles['image-container']}>
            <AssetImage asset={item || nft!} isSmall />
          </div>
          <div>
            <div className={styles.title}>{title}</div>
            {subtitle && <div>{subtitle}</div>}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>{t(`global.${category}`)}</Table.Cell>
      <Table.Cell>{t(`global.${item ? 'primary' : 'secondary'}`)}</Table.Cell>
      <Table.Cell>
        <Mana network={item?.network || nft!.network} inline>
          {formatMANA(item?.price || order!.price)}
        </Mana>
      </Table.Cell>
    </Table.Row>
  )
}

export default React.memo(OnSaleListElement)
