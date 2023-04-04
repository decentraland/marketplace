import { useEffect, useState } from 'react'
import { BarChart } from 'decentraland-ui'
import { Props } from './Inventory.types'

export const Inventory = ({
  fetcher,
  isMana,
  min,
  minLabel,
  max,
  maxLabel,
  network,
  upperBound,
  errorMessage,
  onChange,
  ...rest
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<Record<string, number>>()

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setIsLoading(true)
        const data = await fetcher()
        if (!cancel) {
          setIsLoading(false)
          setData(data)
        }
      } catch (e) {
        if (!cancel) {
          console.warn('Could not fetch inventory data')
          setIsLoading(false)
        }
      }
    })()
    return () => {
      cancel = true
    }
  }, [fetcher])

  return (
    <BarChart
      isMana={isMana}
      minLabel={minLabel}
      maxLabel={maxLabel}
      data={data}
      min={min}
      max={max}
      loading={isLoading}
      upperBound={upperBound}
      network={network}
      onChange={onChange}
      errorMessage={errorMessage}
      {...rest}
    />
  )
}
