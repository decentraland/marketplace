import dateFnsFormat from 'date-fns/format'
import { capitalize } from 'lodash'
import { RentalListing } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from 'decentraland-ui'
import { formatDistanceToNow } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { getRentalChosenPeriod } from '../../../modules/rental/utils'
import { LinkedProfile } from '../../LinkedProfile'
import { DataTableType } from '../../Table/TableContent/TableContent.types'

const INPUT_FORMAT = 'PPP'
const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

const formatEventDate = (updatedAt: number) => {
  const newUpdatedAt = new Date(updatedAt)
  return Date.now() - newUpdatedAt.getTime() > WEEK_IN_MILLISECONDS
    ? dateFnsFormat(newUpdatedAt, INPUT_FORMAT)
    : formatDistanceToNow(newUpdatedAt, { addSuffix: true })
}

export const formatDataToTable = (rentals: RentalListing[]): DataTableType[] => {
  return rentals?.map((rental: RentalListing) => {
    const value: DataTableType = {
      [t('rental_history.lessor')]: <LinkedProfile address={rental.lessor!} />,
      [t('rental_history.tenant')]: <LinkedProfile address={rental.tenant!} />,
      [t('rental_history.started_at')]: formatEventDate(rental.startedAt ?? 0),
      [capitalize(t('global.days'))]: t('rental_history.selected_days', {
        days: rental.rentedDays ?? 0
      }),
      [t('rental_history.price_per_day')]: (
        <Mana network={rental.network} inline>
          {formatWeiMANA(getRentalChosenPeriod(rental).pricePerDay)}
        </Mana>
      )
    }
    return value
  })
}
