import { useEffect, useState } from 'react'
import { BarChart } from 'decentraland-ui'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { Props } from './Inventory.types'

export type InventoryProps = {
  min: string
  max: string
  network?: Network
  onChange: (value: [string, string]) => void
  defaultCollapsed?: boolean
  fetcher: () => Promise<Record<string, number>>
}

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
  onChange
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
        console.warn('Could not fetch inventory data')
        setIsLoading(false)
      }
    })()
    return () => {
      cancel = false
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
    />
  )
}
