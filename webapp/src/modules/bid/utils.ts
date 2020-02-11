import addDays from 'date-fns/addDays'
import dateFnsFormat from 'date-fns/format'

export const DEFAULT_EXPIRATION_IN_DAYS = 30
export const INPUT_FORMAT = 'yyyy-MM-dd'
export const DEFAULT_EXPIRATION_DATE = dateFnsFormat(
  addDays(new Date(), DEFAULT_EXPIRATION_IN_DAYS),
  INPUT_FORMAT
)
