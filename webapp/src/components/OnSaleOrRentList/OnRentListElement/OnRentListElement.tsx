import React from 'react'
import add from 'date-fns/add'
import format from 'date-fns/format'
import { RentalStatus } from '@dcl/schemas'
import { Mobile, NotMobile, Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { Mana } from '../../Mana'
import { formatWeiMANA } from '../../../lib/mana'
import { Props } from './OnRentListElement.types'
import AssetCell from '../AssetCell'
import './OnRentListElement.css'

const OnRentListElement = ({ nft, rental }: Props) => {
  const category = nft!.category
  const { startedAt, rentedDays } = rental
  const startDate = startedAt ? new Date(startedAt) : null
  const endDate =
    startDate && rentedDays ? add(startDate, { days: rentedDays }) : null
  return (
    <>
      <Mobile>
        <div className="mobile-row">
          <AssetCell
            asset={nft}
            link={locations.manage(nft.contractAddress, nft.tokenId)}
          />
          <Mana network={nft.network} inline>
            {formatWeiMANA(rental.periods[0].pricePerDay)}
          </Mana>
        </div>
      </Mobile>
      <NotMobile>
        <Table.Row>
          <Table.Cell>
            <AssetCell
              asset={nft}
              link={locations.manage(nft.contractAddress, nft.tokenId)}
            />
          </Table.Cell>
          <Table.Cell>{t(`global.${category}`)}</Table.Cell>
          <Table.Cell>
            {rental.status === RentalStatus.OPEN
              ? t('on_rent_list.listed_for_rent')
              : endDate
              ? t('on_rent_list.rented_until', {
                  end_date: format(endDate, 'MMM dd')
                })
              : null}
          </Table.Cell>
          <Table.Cell>
            <Mana network={nft.network} inline>
              {formatWeiMANA(rental.periods[0].pricePerDay)}
            </Mana>
          </Table.Cell>
        </Table.Row>
      </NotMobile>
    </>
  )
}

export default React.memo(OnRentListElement)
