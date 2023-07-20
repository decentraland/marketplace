import {
  getCurrentLocale,
  t
} from 'decentraland-dapps/dist/modules/translation/utils'
import formatDistanceToNowI18N from 'date-fns/formatDistanceToNow'
import en from 'date-fns/locale/en-US'
import es from 'date-fns/locale/es'
import zh from 'date-fns/locale/zh-CN'
import format from 'date-fns/format'

const locales: Record<string, Locale> = {
  en,
  es,
  zh
}

// Until recently, the past orders have been stored in milliseconds instead of seconds won't expire until the year 5500 or so.
// This constant puts a limit to the expiration date of the orders, for those orders exceding this, it will show that they never expire.
export const MAX_EXPIRATION_YEAR = 2100

export function getExpirationDateLabel(date: number | Date) {
  date = new Date(date)
  const futureDate = new Date()
  futureDate.setFullYear(MAX_EXPIRATION_YEAR)
  const expiresAtLabel =
    date.getTime() >= futureDate.getTime()
      ? t('best_buying_option.buy_listing.never_expires')
      : `${t('best_buying_option.buy_listing.expires')} ${formatDistanceToNow(
          date,
          {
            addSuffix: true
          }
        )}`
  return expiresAtLabel
}

export function formatDistanceToNow(
  date: number | Date,
  options: {
    includeSeconds?: boolean
    addSuffix?: boolean
    locale?: Locale
  } = {}
) {
  const locale = locales[getCurrentLocale().locale]

  if (locale) {
    options.locale = locale
  }

  return formatDistanceToNowI18N(date, options)
}

export function getDateAndMonthName(date: number | Date) {
  const locale = locales[getCurrentLocale().locale]

  return `${format(new Date(date), 'LLLL', { locale: locale })} ${new Date(
    date
  ).getDate()}`
}
