import React from 'react'
import { Stats, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'

import { Section } from '../../../modules/vendor/decentraland'
import { getContract } from '../../../modules/contract/utils'
import { locations } from '../../../modules/routing/locations'
import { Props } from './WearableCollection.types'
import styles from './WearableCollection.module.css'

const WearableCollection = (props: Props) => {
  const { type, asset } = props
  const contract = getContract({ address: asset.contractAddress })

  return (
    <Stats title={t('asset_page.collection')}>
      <Header>
        <Link
          className={styles.link}
          to={locations.browse({
            assetType: type,
            contracts: [contract.address],
            section: Section.WEARABLES
          })}
        >
          {contract.name}
        </Link>
      </Header>
    </Stats>
  )
}

export default React.memo(WearableCollection)
