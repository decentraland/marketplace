import React from 'react'
import { Header } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../../../modules/routing/locations'
import { Row } from '../../../Layout/Row'
import Coordinate from '../../../Coordinate/Coordinate'
import { Props } from './ParcelCoordinates.types'
import styles from './ParcelCoordinates.module.css'
import { useState } from 'react'
import classNames from 'classnames'

const ParcelCoordinates = (props: Props) => {
  const [isShowingMore, setShowMore] = useState(false)
  const coordinatesClasses = classNames(styles.coordinates, {
    [styles.expanded]: isShowingMore,
    [styles.collapsed]: !isShowingMore
  })

  return (
    <div className={styles.ParcelCoordinates}>
      <Header sub>{t('parcel_coordinates.title')}</Header>
      <Row className={coordinatesClasses}>
        {props.estate.parcels.map((parcel, index) => (
          <Link to={locations.parcel(parcel.x.toString(), parcel.y.toString())}>
            <Coordinate
              className={styles.coordinate}
              key={index}
              x={parcel.x}
              y={parcel.y}
            />
          </Link>
        ))}
      </Row>
      <Row className={styles.showMore}>
        <span onClick={() => setShowMore(!isShowingMore)}>
          {isShowingMore
            ? t('parcel_coordinates.show_less')
            : t('parcel_coordinates.show_more')}
        </span>
      </Row>
    </div>
  )
}

export default React.memo(ParcelCoordinates)
