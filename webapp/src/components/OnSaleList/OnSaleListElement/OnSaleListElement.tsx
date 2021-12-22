import React from 'react'
import { Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from '../../Mana'
import { formatMANA } from '../../../lib/mana'
import { Props } from './OnSaleListElement.types'
import AssetCell from '../AssetCell'

const OnSaleListElement = ({ nft, item, order }: Props) => {
  const category = item?.category || nft!.category

  return (
    <Table.Row>
      <AssetCell asset={item || nft!} />
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
