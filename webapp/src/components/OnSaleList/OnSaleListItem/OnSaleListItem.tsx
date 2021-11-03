import React, { ReactNode } from 'react'
import { Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from '../../Mana'
import { formatMANA } from '../../../lib/mana'
import { Props } from './OnSaleListItem.types'
import { NFTCategory, Rarity } from '@dcl/schemas'
import userSVG from '../../../images/user.svg'
import styles from './OnSaleListItem.module.css'

const OnSaleListItem = ({ nft, item, order }: Props) => {
  let wearableImageBackground: string | undefined

  const category = item?.category || nft!.category

  if (category === NFTCategory.WEARABLE) {
    const rarity = item?.rarity || nft!.data.wearable!.rarity
    const [light, dark] = Rarity.getGradient(rarity)
    wearableImageBackground = `radial-gradient(${light}, ${dark})`
  }

  let itemImage: ReactNode

  switch (category) {
    case NFTCategory.WEARABLE:
      itemImage = (
        <img
          src={item?.thumbnail || nft!.image}
          height={40.19}
          width={40.19}
          alt="foo"
        />
      )
      break
    case NFTCategory.ENS:
      itemImage = <img src={userSVG} alt="foo" />
      break
    case NFTCategory.PARCEL:
      itemImage = <div className={styles.parcel} />
      break
    case NFTCategory.ESTATE:
      itemImage = <div className={styles.estate} />
  }

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
      title = 'Parcer'
  }

  let subtitle: string | undefined

  switch (category) {
    case NFTCategory.ESTATE:
      subtitle = nft!.data.estate!.parcels.length + ' Parcels'
      break
    case NFTCategory.PARCEL:
      const { x, y } = nft!.data.parcel!
      subtitle = `${x}/${y}`
  }

  return (
    <Table.Row>
      <Table.Cell>
        <div className={styles['first-cell']}>
          <div
            className={styles['image-container']}
            style={{
              backgroundImage: wearableImageBackground
            }}
          >
            {itemImage}
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

export default React.memo(OnSaleListItem)
