import React from 'react'
import { getAssetName } from '../../../modules/asset/utils'
import { Props } from './Title.types'
import styles from './Title.module.css'

const Title = ({ asset }: Props) => {
  return <div className={styles.title}>{getAssetName(asset)}</div>
}

export default React.memo(Title)
