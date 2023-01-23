import { Network } from '@dcl/schemas/dist/dapps/network'
import { formatAndRoundPriceString } from './utils'
import { Mana } from '../Mana'
import './PriceChart.css'

export type PriceChartTooltipProps = {
  payload?: {
    payload: { name: string; values: [number, number]; amount: number }
  }[]
  active?: boolean
  network: Network
}

export const PriceChartTooltip = ({
  active,
  payload,
  network
}: PriceChartTooltipProps) => {
  if (active && payload && payload.length && payload[0].payload.amount) {
    const values = payload[0].payload.values
    const isLatestRange = values[0] === values[1]
    const lowerBoundLabel = formatAndRoundPriceString(values[0].toString())
    return (
      <div className="custom-tooltip">
        <Mana network={network}>
          <span>{isLatestRange ? `${lowerBoundLabel}+` : lowerBoundLabel}</span>
        </Mana>
        {!isLatestRange ? (
          <>
            <span className="custom-tooltip-separator">-</span>
            <Mana network={network}>
              <span>{formatAndRoundPriceString(values[1].toString())}</span>
            </Mana>
          </>
        ) : null}
        <span>{`: ${payload[0].payload.amount}`}</span>
      </div>
    )
  }
  return null
}
