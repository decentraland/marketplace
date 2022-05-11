import { Button, Card } from 'decentraland-ui'
import React from 'react'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getMinSaleValueInWei } from '../utils'
import { Price } from '../Price'
import { Props } from './PriceTooLow.types'
import styles from './PriceTooLow.module.css'

const PriceTooLow = (props: Props) => {
  const { chainId, network, onSwitchNetwork } = props

  const humanNetwork = t(`networks.${network.toLowerCase()}`)
  const humanToken = t(`tokens.${network.toLowerCase()}`)

  // We're confident the minimum price exists here, otherwise the component wouldn't be rendered
  const price = <Price network={network} price={getMinSaleValueInWei()!} />

  return (
    <Card className={styles.card}>
      <Card.Content>
        <div className={styles.paragraph}>
          <T id="price_too_low.minimum_price" values={{ price }} />
          <br />
          {t('price_too_low.get_item_in_network', {
            network: humanNetwork,
            token: humanToken
          })}
        </div>
        <div className="buttons">
          <Button
            basic
            size="small"
            href="https://docs.decentraland.org/blockchain-integration/transactions-in-polygon/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('global.learn_more')}
          </Button>
          <Button
            primary
            inverted
            size="small"
            onClick={() => onSwitchNetwork(chainId)}
          >
            {t('price_too_low.switch_network', { network: humanNetwork })}
          </Button>
        </div>
      </Card.Content>
    </Card>
  )
}

export default React.memo(PriceTooLow)
