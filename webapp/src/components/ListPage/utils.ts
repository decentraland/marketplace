import { t } from 'decentraland-dapps/dist/modules/translation/utils'

type Range = keyof typeof ranges
const ranges = {
  years: 3600 * 24 * 365,
  months: 3600 * 24 * 30,
  weeks: 3600 * 24 * 7,
  days: 3600 * 24,
  hours: 3600,
  minutes: 60,
  seconds: 1
}

const formatter = new Intl.RelativeTimeFormat('en')

export function timeAgo(input: string | Date | number) {
  const date = input instanceof Date ? input : new Date(input)
  const secondsElapsed = (date.getTime() - Date.now()) / 1000

  if (Math.abs(secondsElapsed) < ranges.seconds) return t('global.now')

  let key: Range
  for (key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key]
      return formatter.format(Math.round(delta), key)
    }
  }
}
