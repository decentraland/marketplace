import React, { ReactNode } from 'react'
import { Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTCategory, Rarity } from '@dcl/schemas'
import { Mana } from '../../Mana'
import { formatMANA } from '../../../lib/mana'
import userSVG from '../../../images/user.svg'
import { Props } from './OnSaleListItem.types'
import styles from './OnSaleListItem.module.css'

const OnSaleListItem = ({ item }: Props) => {
  let wearableImageBackground: string | undefined

  if (item.type === NFTCategory.WEARABLE) {
    const [light, dark] = Rarity.getGradient(item.rarity)
    wearableImageBackground = `radial-gradient(${light}, ${dark})`
  }

  let itemImage: ReactNode

  switch (item.type) {
    case NFTCategory.WEARABLE:
      itemImage = <img src={item.src} height={40.19} width={40.19} alt="foo" />
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
            <div className={styles.title}>{item.title}</div>
            {item.subtitle && <div>{item.subtitle}</div>}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>{t(`global.${item.type}`)}</Table.Cell>
      <Table.Cell>{t(`global.${item.saleType}`)}</Table.Cell>
      <Table.Cell>
        <Mana network={item.network} inline>
          {formatMANA(item.price)}
        </Mana>
      </Table.Cell>
    </Table.Row>
  )
}

export default React.memo(OnSaleListItem)
