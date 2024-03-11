import React from 'react'
import { Link } from 'react-router-dom'
import { Stats } from 'decentraland-ui'
import { Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { contracts } from '../../../modules/vendor/decentraland/contracts'
import { config } from '../../../config'
import { Network as AppNetwork } from '../../../modules/contract/types'
import CollectionImage from '../../CollectionImage'
import CollectionProvider from '../../CollectionProvider'
import { Props } from './Collection.types'
import styles from './Collection.module.css'

const network = config.get('NETWORK') as AppNetwork

const Collection = (props: Props) => {
  const { asset } = props

  return (
    <CollectionProvider contractAddress={asset.contractAddress}>
      {({ collection, isLoading }) => {
        if (isLoading || !collection) {
          return null
        }

        let name = collection.name
        if (asset.network === Network.ETHEREUM) {
          const networkContracts = contracts[network]
          const contract = networkContracts.find(contract => contract.address === asset.contractAddress)
          name = contract?.name || name
        }

        return (
          <Stats title={t('global.collection')}>
            <Link to={locations.collection(asset.contractAddress)}>
              <div className={styles.container}>
                <div className={styles.image}>
                  <CollectionImage contractAddress={asset.contractAddress} />
                </div>
                <span className={styles.name}>{name}</span>
              </div>
            </Link>
          </Stats>
        )
      }}
    </CollectionProvider>
  )
}

export default React.memo(Collection)
