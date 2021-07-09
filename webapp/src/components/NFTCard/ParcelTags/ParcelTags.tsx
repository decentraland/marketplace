import React from 'react'
import classnames from 'classnames'
import { Coordinate } from '../../Coordinate'
import { ProximityTags } from '../ProximityTags'
import { Props } from './ParcelTags.types'
import styles from './ParcelTags.module.css'

const ParcelTags = (props: Props) => {
  const { nft, className } = props
  const { x, y } = nft.data.parcel!
  return (
    <div className={classnames([styles.ParcelTags, className])}>
      <Coordinate className={styles.coordinates} x={Number(x)} y={Number(y)} />
      <ProximityTags nft={nft} />
    </div>
  )
}

export default ParcelTags
