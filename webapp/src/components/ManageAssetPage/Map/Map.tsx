import React, { useMemo } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { Badge } from 'decentraland-ui'
import { AssetImage } from '../../AssetImage'
import { JumpIn } from '../../AssetPage/JumpIn'
import { Coordinate } from '../../Coordinate'
import { Props } from './Map.types'
import styles from './Map.module.css'

const Map = (props: Props) => {
  const { asset, className } = props

  const coordinates: { x: number; y: number } | null = useMemo(() => {
    switch (asset.category) {
      case NFTCategory.ESTATE: {
        if (asset.data.estate!.size) {
          return {
            x: asset.data.estate!.parcels[0].x,
            y: asset.data.estate!.parcels[0].y
          }
        }
        return null
      }
      case NFTCategory.PARCEL: {
        return {
          x: Number(asset.data.parcel!.x),
          y: Number(asset.data.parcel!.y)
        }
      }
      default:
        return null
    }
  }, [asset])

  return (
    <div className={className}>
      <AssetImage asset={asset} />
      <div className={styles.badges}>
        {coordinates ? (
          <>
            {asset.category === NFTCategory.ESTATE ? (
              <>
                <Badge className={styles.coordinates} color="#37333d">
                  {asset.data.estate!.size.toLocaleString()} LAND
                </Badge>
              </>
            ) : (
              <Coordinate
                className={styles.coordinates}
                x={coordinates.x}
                y={coordinates.y}
              />
            )}
            <JumpIn compact x={coordinates.x} y={coordinates.y} />
          </>
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(Map)
