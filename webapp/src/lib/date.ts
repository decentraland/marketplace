import formatDistanceToNowI18N from 'date-fns/formatDistanceToNow'
import en from 'date-fns/locale/en-US'
import es from 'date-fns/locale/es'
import zh from 'date-fns/locale/zh-CN'
import { getLocale } from 'decentraland-dapps/dist/modules/translation/selectors'
import { store } from '../modules/store'
import { RootState } from '../modules/reducer'

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
  const state = store.getState() as RootState
  const current = getLocale(state)
  const locale = locales[current as string]

  if (locale) {
    options.locale = locale
  }

  return formatDistanceToNowI18N(date, options)
}
