import React from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'
import { locations } from '../../../../modules/routing/locations'
import { Collapsible } from '../../../Collapsible'
import Coordinate from '../../../Coordinate/Coordinate'
import { Row } from '../../../Layout/Row'
import { Props } from './ParcelCoordinates.types'
import styles from './ParcelCoordinates.module.css'

const ParcelCoordinates = (props: Props) => {
  const { parcelCoordinates } = props

  return (
    <div className={styles.ParcelCoordinates}>
      <Header sub>{t('parcel_coordinates.title')}</Header>
      <Collapsible collapsedHeight={60}>
        <Row className={styles.coordinates}>
          {parcelCoordinates.map((parcel, index) => (
            <Link key={index} to={locations.parcel(parcel.x.toString(), parcel.y.toString())}>
              <Coordinate className={styles.coordinate} x={parcel.x} y={parcel.y} />
            </Link>
          ))}
        </Row>
      </Collapsible>
    </div>
  )
}

export default React.memo(ParcelCoordinates)
