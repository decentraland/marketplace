import React, { useCallback, useMemo } from 'react'
import { ethers } from 'ethers'
import { Switch } from 'decentraland-ui2'
import { Props } from './UseCreditsToggle.types'
import styles from './UseCreditsToggle.module.css'

const UseCreditsToggle = ({ credits, isOwner, useCredits, onUseCredits }: Props) => {
  const handleToggleCredits = useCallback(() => {
    onUseCredits(!useCredits)
  }, [useCredits, onUseCredits])

  // convert credits to eth, they are stored in wei
  const creditsInEth = useMemo(() => {
    if (!credits || !credits.totalCredits) {
      return '0'
    }

    const inEth = ethers.utils.formatEther(credits.totalCredits.toString())
    // remove the decimal part if integer
    return inEth.includes('.') ? inEth.split('.')[0] : inEth
  }, [credits?.totalCredits])

  // If the user is the owner or the credits are not available, we don't show the toggle
  if (!credits || !credits.totalCredits || isOwner) {
    return null
  }

  return (
    <div className={`${styles.creditsContainer} ${useCredits ? styles.creditsContainerActive : ''}`}>
      <div className={styles.creditsLeft}>
        <Switch checked={useCredits} onChange={handleToggleCredits} />
        <span className={styles.creditsText}>Use Credits</span>
      </div>
      <span className={styles.creditsAmount}>
        <span className={styles.creditsNumber}>{creditsInEth}</span>
      </span>
    </div>
  )
}

export default React.memo(UseCreditsToggle)
