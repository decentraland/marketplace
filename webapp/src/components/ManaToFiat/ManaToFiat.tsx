import React, { useEffect } from 'react'
import { utils } from 'ethers'
import { TokenConverter } from '../../modules/vendor/TokenConverter'
import { Props } from './ManaToFiat.types'

const ManaToFiat = (props: Props) => {
  const { mana, digits = 2 } = props
  const [fiatValue, setFiatValue] = React.useState<number>()

  useEffect(() => {
    ;(async () => {
      try {
        setFiatValue(
          await new TokenConverter().marketMANAToUSD(
            parseFloat(utils.formatEther(mana))
          )
        )
      } catch (error) {}
    })()
  }, [mana])

  return fiatValue ? <>${fiatValue.toFixed(digits)}</> : null
}

export default React.memo(ManaToFiat)
