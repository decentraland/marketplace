import React from 'react'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Card } from 'decentraland-ui'
import { Price } from '../Price'
import { Props } from './PriceHasChanged.types'
import styles from './PriceHasChanged.module.css'

const PriceHasChanged = (props: Props) => {
  const { asset, newPrice } = props

  return (
    <Card className={styles.card}>
      <Card.Content>
        <div className={styles.paragraph}>
          <T
            id="asset_price_has_changed"
            values={{
              name: <b>{asset.name}</b>,
              amount: <Price network={asset.network} price={newPrice} />
            }}
          />
        </div>
      </Card.Content>
    </Card>
  )
}

export default React.memo(PriceHasChanged)
