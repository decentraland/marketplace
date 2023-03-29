import React from 'react'

import { Props } from './AvailableForMint.types'
import styles from './AvailableForMint.module.css'

const OwnersTable = (props: Props) => {
  const { nft } = props

  return (
    <div className={styles.AvailableForMint}>available for mint {nft.name}</div>
  )
}

export default React.memo(OwnersTable)
