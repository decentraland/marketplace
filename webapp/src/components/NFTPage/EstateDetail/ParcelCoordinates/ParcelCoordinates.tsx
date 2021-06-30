import React from 'react'
import { Header } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../../../modules/routing/locations'
import { Row } from '../../../Layout/Row'
import Coordinate from '../../../Coordinate/Coordinate'
import { Props } from './ParcelCoordinates.types'
import './ParcelCoordinates.css'

const ParcelCoordinates = (props: Props) => {
  return (
    <div className="ParcelCoordinates">
      <Header sub>{t('parcel_coordinates.title')}</Header>
      <Row className="coordinates">
        {props.estate.parcels.map((parcel, index) => (
          <Link to={locations.parcel(parcel.x.toString(), parcel.y.toString())}>
            <Coordinate
              className="coordinate"
              key={index}
              x={parcel.x}
              y={parcel.y}
            />
          </Link>
        ))}
      </Row>
    </div>
  )
}

export default React.memo(ParcelCoordinates)
