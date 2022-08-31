import React, { useEffect } from 'react'
import { utils } from 'ethers'
import { TokenConverter } from '../../modules/vendor/TokenConverter'
import { Props } from './ManaToFiat.types'

const ManaToFiat = (props: Props) => {
  const { mana, digits = 2 } = props
  const [fiatValue, setFiatValue] = React.useState<number>()

  useEffect(() => {
    try {
      const value = parseFloat(utils.formatEther(mana))
      new TokenConverter()
        .marketMANAToUSD(value)
        .then(usd => {
          setFiatValue(usd)
        })
        .catch()
    } catch (error) {
      // do nothing
    }
  }, [mana])

  return fiatValue ? (
    <>
      $
      {Number(fiatValue.toFixed(digits)).toLocaleString(undefined, {
        maximumFractionDigits: 2
      })}
    </>
  ) : null
}

export default React.memo(ManaToFiat)
