export const HOVERED_BAR_COLOR = 'pink'
export const LOADING_BAR_COLOR = 'grey'
export const ACTIVE_BAR_COLOR = '#ff2d55'
export const NON_ACTIVE_BAR_COLOR = '#4f1414'
export const PRICE_CHART_LOG_SCALE = 5
const PRICE_CHART_BAR_QTY = 24

export const priceFormatter = Intl.NumberFormat('en', {
  notation: 'compact'
} as Intl.NumberFormatOptions)

export const formatAndRoundPriceString = (price: string) => {
  return priceFormatter.format(Number(price))
}

export const roundRange = (range: number[]): [string, string] => {
  return [roundNumber(range[0]).toString(), roundNumber(range[1]).toString()]
}

export const formatPriceString = (price: string, decimals = 0) => {
  return Number(price)
    .toFixed(decimals)
    .toLocaleString()
}

const formatPrice = (price: string) => roundNumber(Number(price))

export const inverseScale = (number: number) => {
  // avoid doing Math.log(0) which would return Inifity
  return number !== 0 ? Math.log(number) / Math.log(PRICE_CHART_LOG_SCALE) : 0
}

export const roundNumber = (number: number) => {
  let exp = 1
  if (number < 10) {
    return Number(number.toFixed(2))
  }
  if (number > 100) exp = 100
  if (number > 1000) exp = 1000
  return Math.round(number / exp) * exp
}

export const createExponentialRange = (
  min: number,
  max: number,
  upperBound?: number
) => {
  const rangeMin = inverseScale(min)
  const rangeMax = inverseScale(max)
  const step = (rangeMax - rangeMin) / PRICE_CHART_BAR_QTY
  const arr: number[] = []
  for (let i = 0; i < PRICE_CHART_BAR_QTY; i++) {
    const prev = arr[i - 1]
    arr.push(prev !== undefined ? prev + step : rangeMin)
  }

  return [
    ...arr.map(interval =>
      interval !== 0
        ? roundNumber(Math.pow(PRICE_CHART_LOG_SCALE, interval))
        : interval
    ),
    ...(upperBound && max > upperBound ? [upperBound] : [])
  ]
}

export const getBarChartRanges = (
  data: Record<string, number>,
  min: number,
  max: number,
  upperBound?: number
) => {
  const ranges = createExponentialRange(min, max, upperBound)
  const bars = ranges.reduce((acc, range) => {
    acc.set(range, 0)
    return acc
  }, new Map())
  try {
    // iterates each data entry of <price, itemsWithThatPrice>
    Object.entries(data).forEach(([key, value]) => {
      const formattedPrice = formatPrice(key)
      const upperBoundIdx = ranges.findIndex(range => formattedPrice < range)
      let upperBound =
        ranges[upperBoundIdx > 0 ? upperBoundIdx - 1 : upperBoundIdx]
      if (upperBound === undefined) {
        upperBound = ranges[ranges.length - 1]
      }
      const currentValueForRange = bars.get(upperBound) || 0
      bars.set(upperBound, currentValueForRange + value)
    })

    const final = []
    const mapIterator = bars.entries()
    let interval: [string, number] = mapIterator.next().value
    while (interval) {
      const [maxPriceOfInterval, amount] = interval
      const nextInterval = mapIterator.next().value
      final.push({
        values: [
          Number(maxPriceOfInterval),
          nextInterval ? Number(nextInterval[0]) : Number(maxPriceOfInterval)
        ],
        amount
      })
      interval = nextInterval
    }

    return final
  } catch (error) {
    throw Error('Error generating bar chart')
  }
}

export const isValuesInCurrentRange = (
  range: number[],
  min: number,
  max: number
) => {
  return (
    (range[0] >= min || range[1] > min) && (range[0] < max || range[1] <= max)
  )
}

export const formatValueToLocale = (
  value: [string, string]
): [string, string] => {
  const formattedMin = Number(value[0]).toLocaleString()
  const formattedMax = Number(value[1]).toLocaleString()
  return [formattedMin, formattedMax]
}

export const getFlooredFixed = (v: number, d: number) => {
  return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d)
}

export const removePricesOutOfRange = (
  prices: Record<number, number>,
  upperBound?: number
) => {
  if (!upperBound) {
    return prices
  }
  return Object.entries(prices).reduce((acc, [key, value]) => {
    if (Number(key) <= upperBound) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, number>)
}

export const getDatasetBounds = (prices: Record<string, number>) => {
  const formattedPrices = Object.keys(prices).map(price => Number(price))
  return {
    min: Math.min(...formattedPrices),
    max: Math.max(...formattedPrices)
  }
}
