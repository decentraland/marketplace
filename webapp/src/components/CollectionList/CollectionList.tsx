import React from 'react'
import { Card, Loader } from 'decentraland-ui'
import styles from './CollectionList.module.css'
import listedSvg from '../../images/listed.svg'
import { Props } from './CollectionList.types'

const CollectionList = ({ collections, isLoading }: Props) => {
  return (
    <>
      {isLoading ? (
        <>
          <div className="overlay" />
          <Loader size="massive" active />
        </>
      ) : (
        collections.map(collection => (
          <Card key={collection.urn} className={styles.card} fluid>
            <Card.Content className={styles.cardContent}>
              <div className={styles.detailsContainer}>
                <div className={styles.detailsLeft}>
                  <div className={styles.image}></div>
                </div>
                <div className={styles.detailsRight}>
                  <div className={styles.name}>{collection.name}</div>
                  <div className={styles.count}>4 Items</div>
                </div>
              </div>
              {collection.isOnSale && (
                <img className={styles.listed} src={listedSvg} alt="listed" />
              )}
            </Card.Content>
          </Card>
        ))
      )}
    </>
  )
}

export default React.memo(CollectionList)
