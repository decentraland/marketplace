import React from 'react'
import { Mobile, NotMobile, Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from '../../Mana'
import { formatWeiMANA } from '../../../lib/mana'
import { Props } from './OnSaleListElement.types'
import AssetCell from '../AssetCell'
import './OnSaleListElement.css'

const OnSaleListElement = ({ nft, item, order }: Props) => {
  const category = item?.category || nft!.category

  return (
    <>
      <Mobile>
        <div className="mobile-row">
          <AssetCell asset={item || nft!} />
          <Mana network={item?.network || nft!.network} inline>
            {formatWeiMANA(item?.price || order!.price)}
          </Mana>
        </div>
      </Mobile>
      <NotMobile>
        <Table.Row>
          <Table.Cell>
            <AssetCell asset={item || nft!} />
          </Table.Cell>
          <Table.Cell>{t(`global.${category}`)}</Table.Cell>
          <Table.Cell>
            {t(`global.${item ? 'primary' : 'secondary'}`)}
          </Table.Cell>
          <Table.Cell>
            <Mana network={item?.network || nft!.network} inline>
              {formatWeiMANA(item?.price || order!.price)}
            </Mana>
          </Table.Cell>
        </Table.Row>
      </NotMobile>
    </>
  )
}

export default React.memo(OnSaleListElement)
