import React, { useEffect } from 'react'
import { utils } from 'ethers'
import { TokenConverter } from '../../modules/vendor/TokenConverter'
import { Props } from './ManaToFiat.types'

const ONE_MILLION = { value: 1000000, displayValue: 'M' }
const ONE_BILLION = { value: 1000000000, displayValue: 'B' }
const ONE_TRILLION = { value: 1000000000000, displayValue: 'T' }

const ManaToFiat = (props: Props) => {
  const { mana, digits = 2 } = props
  const [fiatValue, setFiatValue] = React.useState<string>()

  useEffect(() => {
    let cancel = false
    try {
      const value = parseFloat(utils.formatEther(mana))
      new TokenConverter()
        .marketMANAToUSD(value)
        .then(usd => {
          const divider =
            usd > ONE_TRILLION.value
              ? ONE_TRILLION
              : usd > ONE_BILLION.value
                ? ONE_BILLION
                : usd > ONE_MILLION.value
                  ? ONE_MILLION
                  : { value: 1, displayValue: '' }
          if (cancel) return
          setFiatValue(
            `$${(+(+usd / divider.value).toFixed(digits)).toLocaleString(undefined, {
              maximumFractionDigits: digits
            })}${divider.displayValue}`
          )
        })
        .catch()
    } catch (error) {
      // do nothing
    }
    return () => {
      cancel = true
    }
  }, [digits, mana])

  return fiatValue ? <>{fiatValue}</> : null
}

export default React.memo(ManaToFiat)
