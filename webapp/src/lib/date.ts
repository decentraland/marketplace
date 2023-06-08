import { getCurrentLocale } from 'decentraland-dapps/dist/modules/translation/utils'
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
