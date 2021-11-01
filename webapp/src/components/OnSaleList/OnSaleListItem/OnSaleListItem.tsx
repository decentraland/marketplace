import React, { ReactNode } from 'react'
import { Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTCategory, Rarity } from '@dcl/schemas'
import { Mana } from '../../Mana'
import { formatMANA } from '../../../lib/mana'
import userSVG from '../../../images/user.svg'
import { Props } from './OnSaleListItem.types'

const OnSaleListItem = ({ item }: Props) => {
  let wearableImageBackground: string | undefined

  if (item.type === NFTCategory.WEARABLE) {
    const [light, dark] = Rarity.getGradient(Rarity.MYTHIC)
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
      itemImage = (
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: '#FF2D55'
          }}
        />
      )
      break
    case NFTCategory.ESTATE:
      itemImage = (
        <div
          style={{
            width: 28,
            height: 28,
            backgroundColor: '#FF2D55'
          }}
        />
      )
  }

  return (
    <Table.Row>
      <Table.Cell>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              marginRight: '1rem',
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 48,
              height: 48,
              backgroundColor: '#242129',
              backgroundImage: wearableImageBackground
            }}
          >
            {itemImage}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{item.title}</div>
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
