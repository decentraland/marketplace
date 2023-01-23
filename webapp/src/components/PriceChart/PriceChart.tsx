import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import classNames from 'classnames'
import { RangeField, SliderField, Loader } from 'decentraland-ui'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import {
  ACTIVE_BAR_COLOR,
  getBarChartRanges,
  getDatasetBounds,
  getFlooredFixed,
  HOVERED_BAR_COLOR,
  inverseScale,
  isValuesInCurrentRange,
  LOADING_BAR_COLOR,
  NON_ACTIVE_BAR_COLOR,
  priceFormatter,
  PRICE_CHART_LOG_SCALE,
  roundNumber,
  roundRange
} from './utils'
import { PriceChartProps } from './PriceChart.types'
import { Mana } from '../Mana'
import { PriceChartTooltip } from './PriceChartTooltip'
import './PriceChart.css'

const DEFAULT_SLIDER_STEP = 0.1

type Range = {
  amount: number
  values: number[]
}

export const PriceChart = ({
  height = 150,
  width = '100%',
  prices,
  upperBound,
  loading,
  onChange,
  minPrice,
  maxPrice,
  network = Network.ETHEREUM,
  sliderStep = DEFAULT_SLIDER_STEP,
  errorMessage
}: PriceChartProps) => {
  const [value, setValue] = useState<[string, string]>([minPrice, maxPrice])
  const [ranges, setRanges] = useState<Range[]>()
  const [activeBar, setActiveBar] = useState<number>()
  const [rangeMax, setRangeMax] = useState<number>()
  const [rangeMin, setRangeMin] = useState<number>()
  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => setValue([minPrice, maxPrice]), [minPrice, maxPrice])

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  useEffect(() => {
    if (prices) {
      try {
        const formattedPrices = Object.keys(prices).map(price => Number(price))
        const maxValueFromDataset = Math.max(...formattedPrices)
        const maxValue = upperBound
          ? upperBound < maxValueFromDataset
            ? upperBound
            : maxValueFromDataset
          : maxValueFromDataset
        const minValue = Math.min(...formattedPrices)
        setRangeMax(maxValue)
        setRangeMin(minValue)
        setRanges(getBarChartRanges(prices, minValue, maxValue, upperBound))
      } catch (error) {
        console.error('error: ', error)
      }
    }
  }, [prices, upperBound])

  const inputMaxRangeValue = useMemo(
    () => (rangeMax !== undefined ? inverseScale(rangeMax) : undefined),
    [rangeMax]
  )

  const inputMinRangeValue = useMemo(
    () => (rangeMin !== undefined ? inverseScale(rangeMin) : undefined),
    [rangeMin]
  )

  const valueFromForRangeInput = useMemo(() => {
    const scaledValue = value[0]
      ? inverseScale(Number(value[0]))
      : Number(inputMinRangeValue)
    // scaledValue can't be less than the input range min value
    return inputMinRangeValue !== undefined && scaledValue > inputMinRangeValue
      ? scaledValue
      : inputMinRangeValue
  }, [inputMinRangeValue, value])

  const valueToForRangeInput = useMemo(() => {
    const scaledValue = value[1]
      ? inverseScale(Number(value[1]))
      : Number(inputMaxRangeValue)
    // scaledValue can't be greater than the input range max value
    return inputMaxRangeValue !== undefined && scaledValue < inputMaxRangeValue
      ? scaledValue
      : inputMaxRangeValue
  }, [inputMaxRangeValue, value])

  const showMaxErrorPrice = useMemo(
    () => value[0] && value[1] && Number(value[1]) <= Number(value[0]),
    [value]
  )

  // Slider variables to display
  const sliderMinLabel = useMemo(() => {
    const min = value[0] ? Number(value[0]) : rangeMin ? rangeMin : ''
    return priceFormatter.format(Number(min))
  }, [rangeMin, value])

  const sliderMaxLabel = useMemo(() => {
    if (prices) {
      const { max: datasetMax } = getDatasetBounds(prices)
      const currentMax = Number(value[1] || rangeMax)
      const isInputAtMaxValue = currentMax === rangeMax
      return `${priceFormatter.format(Number(currentMax))}${
        isInputAtMaxValue && upperBound && upperBound < datasetMax ? '+' : ''
      }`
    }
  }, [prices, rangeMax, upperBound, value])

  // Component handlers
  const handlePriceChange = useCallback(
    (newValue: [string, string]) => {
      setValue(newValue)
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
      timeout.current = (setTimeout(
        () => onChange(newValue),
        500
      ) as unknown) as NodeJS.Timeout
    },
    [setValue, onChange]
  )

  const handleRangeChange = useCallback(
    (_, [min, max]) => {
      if (
        rangeMax !== undefined &&
        rangeMin !== undefined &&
        inputMaxRangeValue
      ) {
        // it can happend that the slider doesn't go all the way to the max because there's no room for other step.
        // So we compare the diff to the input step. If it's lower, we programmatically move it to the max
        const remainingToMax = inputMaxRangeValue - max
        const isTheMaxValue =
          getFlooredFixed(max, 1) ===
            getFlooredFixed(Number(inputMaxRangeValue), 1) ||
          remainingToMax <= sliderStep

        const formattedMin =
          min === rangeMin ? rangeMin : Math.pow(PRICE_CHART_LOG_SCALE, min)
        const formattedMax = isTheMaxValue
          ? rangeMax
          : Math.pow(PRICE_CHART_LOG_SCALE, max)

        const newValue: [string, string] = [
          roundNumber(formattedMin).toString(),
          roundNumber(formattedMax).toString()
        ]
        setValue(newValue)
        handlePriceChange(newValue)
      }
    },
    [handlePriceChange, inputMaxRangeValue, rangeMax, rangeMin, sliderStep]
  )

  // Bar chart handlers
  const handleBarChartMouseMove = useCallback(e => {
    setActiveBar(e.activeTooltipIndex)
  }, [])

  const handleBarChartMouseLeave = useCallback(() => {
    setActiveBar(undefined)
  }, [])

  const handleBarChartClick = useCallback(
    ({ activePayload }) => {
      const values = activePayload[0].payload.values
      const isUpperBoundRange = values[0] === values[1]

      handlePriceChange(
        isUpperBoundRange
          ? [values[0], '']
          : roundRange(activePayload[0].payload.values)
      )
    },
    [handlePriceChange]
  )

  const renderBarCell = useCallback(
    (entry: Range, index: number) => {
      const isActiveRange = isValuesInCurrentRange(
        entry.values,
        Number(value[0] || rangeMin),
        Number(value[1] || rangeMax)
      )
      return (
        <Cell
          key={`cell-${index}`}
          fill={
            activeBar === index
              ? HOVERED_BAR_COLOR
              : loading
              ? LOADING_BAR_COLOR
              : isActiveRange
              ? ACTIVE_BAR_COLOR
              : NON_ACTIVE_BAR_COLOR
          }
        />
      )
    },
    [activeBar, loading, rangeMax, rangeMin, value]
  )

  return (
    <div className="price-filter">
      <RangeField
        minProps={{
          icon: <Mana network={network} />,
          iconPosition: 'left',
          placeholder: 0
        }}
        maxProps={{
          icon: <Mana network={network} />,
          iconPosition: 'left',
          placeholder: 1000
        }}
        onChange={handlePriceChange}
        value={value}
      />

      {loading ? (
        <div
          className={classNames(
            'loader-container',
            !prices && 'no-data-loading-layer'
          )}
        >
          <div className="loading-layer" />
          <Loader active />
        </div>
      ) : null}

      {!!prices && !!ranges && !!inputMaxRangeValue && (
        <>
          <ResponsiveContainer width={width} height={height}>
            <BarChart
              data={ranges}
              margin={{ top: 20, right: 12, left: 12 }}
              onMouseMove={handleBarChartMouseMove}
              onMouseLeave={handleBarChartMouseLeave}
              onClick={handleBarChartClick}
            >
              <Tooltip
                cursor={false}
                content={<PriceChartTooltip network={network} />}
                position={{ y: 25 }}
              />
              <Bar dataKey="amount" barSize={8}>
                {ranges?.map(renderBarCell)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <SliderField
            header=""
            range
            valueFrom={valueFromForRangeInput}
            valueTo={valueToForRangeInput}
            min={inputMinRangeValue}
            max={inputMaxRangeValue}
            step={sliderStep}
            onChange={handleRangeChange}
          />
          <div className="price-input-container">
            <Mana network={network}>{sliderMinLabel}</Mana>
            <Mana network={network}>{sliderMaxLabel}</Mana>
          </div>
          {errorMessage && showMaxErrorPrice ? (
            <span className="price-filter-error">{errorMessage}</span>
          ) : null}
        </>
      )}
    </div>
  )
}
