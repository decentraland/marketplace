import dateFnsFormat from 'date-fns/format'
import { Sale } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from 'decentraland-ui'
import { formatDistanceToNow } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { LinkedProfile } from '../../LinkedProfile'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import './TransactionHistory.css'

const INPUT_FORMAT = 'PPP'
const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

const formatEventDate = (updatedAt: number) => {
  const newUpdatedAt = new Date(updatedAt)
  return Date.now() - newUpdatedAt.getTime() > WEEK_IN_MILLISECONDS
    ? dateFnsFormat(newUpdatedAt, INPUT_FORMAT)
    : formatDistanceToNow(newUpdatedAt, { addSuffix: true })
}

export const formatDataToTable = (
  sales: Sale[],
  isMobile = false
): DataTableType[] => {
  return sales?.map((sale: Sale) => {
    const value: DataTableType = {
      ...(!isMobile && {
        [t('transaction_history.from')]: (
          <LinkedProfile address={sale.seller} className="linkedProfile" />
        )
      }),
      ...(!isMobile && {
        [t('transaction_history.to')]: (
          <LinkedProfile address={sale.buyer} className="linkedProfile" />
        )
      }),
      [t('transaction_history.type')]: t(`global.${sale.type}`),
      [t('transaction_history.when')]: formatEventDate(sale.timestamp),
      [t('transaction_history.price')]: (
        <Mana network={sale.network} inline>
          {formatWeiMANA(sale.price)}
        </Mana>
      )
    }
    return value
  })
}
