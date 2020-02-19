import React, { useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { useFingerprint } from '../../../modules/nft/hooks'
import { isInsufficientMANA } from '../../../modules/bid/utils'
import { Props } from './WarningMessage.types'
import './WarningMessage.css'
import { checkFingerprint } from '../utils'

const WarningMessage = (props: Props) => {
  const { nft, bid } = props

  const [fingerprint] = useFingerprint(nft)
  const [notEnoughMana, setNotEnoughMana] = useState(false)

  useEffect(() => {
    isInsufficientMANA(bid).then(setNotEnoughMana)
  }, [bid])

  const isValidFingerprint = checkFingerprint(bid, fingerprint)

  if (notEnoughMana) {
    return (
      <div className="WarningMessage">
        {t('bid.not_enough_mana_on_bid_placed')}
      </div>
    )
  } else if (!isValidFingerprint) {
    return (
      <div className="WarningMessage">
        {t('bid.invalid_fingerprint_on_bid_placed')}
      </div>
    )
  }

  return null
}

export default React.memo(WarningMessage)
