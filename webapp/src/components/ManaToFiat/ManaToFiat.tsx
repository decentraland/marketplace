import React, { useEffect } from 'react'
import { utils } from 'ethers'
import { TokenConverter } from '../../modules/vendor/TokenConverter'
import { Props } from './ManaToFiat.types'

const ONE_MILLION = 1000000
const ONE_BILLION = 1000000000
const ONE_TRILLION = 1000000000000

const ManaToFiat = (props: Props) => {
  const { mana, digits = 2 } = props
  const [fiatValue, setFiatValue] = React.useState<string>()

  useEffect(() => {
    try {
      const value = parseFloat(utils.formatEther(mana))
      new TokenConverter()
        .marketMANAToUSD(value)
        .then(usd => {
          if (usd > ONE_TRILLION) {
            setFiatValue(
              `$ ${(+(+usd / ONE_TRILLION).toFixed(digits)).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2
                }
              )}T`
            )
          } else if (usd > ONE_BILLION) {
            setFiatValue(
              `$ ${(+(+usd / ONE_BILLION).toFixed(digits)).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2
                }
              )}B`
            )
          } else if (usd > ONE_MILLION) {
            setFiatValue(
              `$ ${(+(+usd / ONE_MILLION).toFixed(digits)).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2
                }
              )}M`
            )
          } else {
            setFiatValue(
              `$ ${(+usd.toFixed(digits)).toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}`
            )
          }
        })
        .catch()
    } catch (error) {
      // do nothing
    }
  }, [digits, mana])

  return fiatValue ? <>{fiatValue}</> : null
}

export default React.memo(ManaToFiat)
