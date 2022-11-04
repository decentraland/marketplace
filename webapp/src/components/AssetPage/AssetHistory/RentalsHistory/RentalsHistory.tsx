import { Link } from 'react-router-dom'
import React, { useCallback } from 'react'
import { RentalListing } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'

import { locations } from '../../../../modules/routing/locations'
import { rentalsAPI } from '../../../../modules/vendor/decentraland/rentals/api'
import { formatWeiMANA } from '../../../../lib/mana'
import { Mana } from '../../../Mana'
import { HistoryTable } from '../HistoryTable'
import { formatDateTitle, formatEventDate } from '../utils'
import { Props } from './RentalsHistory.types'

const RentalsHistory = (props: Props) => {
  const { asset } = props
  const network = asset ? asset.network : undefined

  const loadHistoryItems = useCallback(
    (limit: number, page: number) =>
      rentalsAPI.getRentalListings({
        contractAddresses: [asset.contractAddress],
        tokenId: asset.tokenId,
        limit,
        page
      }),
    [asset.contractAddress, asset.tokenId]
  )

  // TODO: set selected_days and pricePerDay
  const getHistoryItemDesktopColumns = useCallback(
    (
      rental: RentalListing & { selected_days: number; selected_period: number }
    ) => [
      {
        content: (
          <Link to={locations.account(rental.lessor!)}>
            <Profile address={rental.lessor!} />
          </Link>
        )
      },
      {
        content: (
          <Link to={locations.account(rental.tenant!)}>
            <Profile address={rental.tenant!} />
          </Link>
        )
      },
      {
        content: formatEventDate(rental.startedAt!),
        props: { title: formatDateTitle(rental.startedAt!) }
      },
      {
        content: t('rental_history.selected_days', rental.selected_days ?? 0)
      },
      {
        content: (
          <Mana network={network} inline>
            {formatWeiMANA(
              rental.periods[rental.selected_period ?? 0].pricePerDay
            )}
          </Mana>
        )
      }
    ],
    [network]
  )

  // TODO: set selected_days and pricePerDay
  const getHistoryItemMobileColumns = useCallback(
    (
      rental: RentalListing & { selected_days: number; selected_period: number }
    ) => ({
      summary: (
        <T
          id="rental_history.mobile_price"
          values={{
            pricePerDay: (
              <Mana network={network} inline>
                {formatWeiMANA(
                  rental.periods[rental.selected_period ?? 0].pricePerDay
                )}
              </Mana>
            )
          }}
        />
      ),
      date: formatEventDate(rental.startedAt!)
    }),
    [network]
  )

  // TODO: fix types
  return (
    <HistoryTable
      title={t('rental_history.title')}
      asset={asset}
      loadHistoryItems={loadHistoryItems as any}
      historyItemsHeaders={[
        { content: t('rental_history.lessor') },
        { content: t('rental_history.tenant') },
        { content: t('rental_history.started_at') },
        { content: t('rental_history.days') },
        { content: t('rental_history.price_per_day') }
      ]}
      getHistoryItemDesktopColumns={getHistoryItemDesktopColumns as any}
      getHistoryItemMobileColumns={getHistoryItemMobileColumns as any}
    />
  )
}

export default React.memo(RentalsHistory)
