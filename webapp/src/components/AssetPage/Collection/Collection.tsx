import React from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { Props } from './Collection.types'
import CollectionImage from '../../CollectionImage'
import { Stats } from 'decentraland-ui'
import CollectionProvider from '../../CollectionProvider'
import styles from './Collection.module.css'

const Collection = (props: Props) => {
  const { asset } = props

  return (
    <CollectionProvider contractAddress={asset.contractAddress}>
      {({ collection, isLoading }) => {
        if (isLoading || !collection) {
          return null
        }

        return (
          <Stats title={t('global.collection')}>
            <Link to={locations.collection(asset.contractAddress)}>
              <div className={styles.container}>
                <div className={styles.image}>
                  <CollectionImage contractAddress={asset.contractAddress} />
                </div>
                <span className={styles.name}>{collection.name}</span>
              </div>
            </Link>
          </Stats>
        )
      }}
    </CollectionProvider>
  )
}

export default React.memo(Collection)
