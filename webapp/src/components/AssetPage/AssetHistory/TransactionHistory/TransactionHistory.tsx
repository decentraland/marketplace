import { Link } from 'react-router-dom'
import React, { useCallback } from 'react'
import { Sale } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'

import { locations } from '../../../../modules/routing/locations'
import { saleAPI } from '../../../../modules/vendor/decentraland'
import { formatWeiMANA } from '../../../../lib/mana'
import { Mana } from '../../../Mana'
import { HistoryTable } from '../HistoryTable'
import { formatDateTitle, formatEventDate } from '../utils'
import { Props } from './TransactionHistory.types'

const RentalsHistory = (props: Props) => {
  const { asset } = props
  const network = asset ? asset.network : undefined

  const loadHistoryItems = useCallback(
    (limit: number, page: number) =>
      saleAPI.fetch({
        contractAddress: asset.contractAddress,
        first: limit,
        skip: page,
        tokenId: 'tokenId' in asset ? asset.tokenId : asset.itemId
      }),
    [asset]
  )

  const getHistoryItemDesktopColumns = useCallback(
    (sale: Sale) => [
      {
        content: (
          <Link to={locations.account(sale.seller)}>
            <Profile address={sale.seller!} />
          </Link>
        )
      },
      {
        content: (
          <Link to={locations.account(sale.buyer)}>
            <Profile address={sale.buyer} />
          </Link>
        )
      },
      {
        content: t(`global.${sale.type}`)
      },
      {
        content: formatEventDate(sale.timestamp),
        props: { title: formatDateTitle(sale.timestamp) }
      },
      {
        content: (
          <Mana network={network} inline>
            {formatWeiMANA(sale.price)}
          </Mana>
        )
      }
    ],
    [network]
  )

  const getHistoryItemMobileColumns = useCallback(
    (sale: Sale) => ({
      summary: (
        <Mana network={network} inline>
          {formatWeiMANA(sale.price)}
        </Mana>
      ),
      date: formatEventDate(sale.timestamp)
    }),
    [network]
  )

  // TODO: fix types
  return (
    <HistoryTable
      title={t('transaction_history.title')}
      asset={asset}
      loadHistoryItems={loadHistoryItems as any}
      historyItemsHeaders={[
        { content: t('transaction_history.from') },
        { content: t('transaction_history.to') },
        { content: t('transaction_history.type') },
        { content: t('transaction_history.when') },
        { content: t('transaction_history.price') }
      ]}
      getHistoryItemDesktopColumns={getHistoryItemDesktopColumns as any}
      getHistoryItemMobileColumns={getHistoryItemMobileColumns as any}
    />
  )
}

export default React.memo(RentalsHistory)
