import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Card, Icon } from 'decentraland-ui'
import { Mana } from '../../Mana'
import { Props } from './NotEnoughMana.types'
import styles from './NotEnoughMana.module.css'

const NotEnoughMana = (props: Props) => {
  const { asset, description, onGetMana, onBuyWithCard } = props

  return (
    <Card className={styles.card}>
      <Card.Content>
        <div className={styles.paragraph}>{description}</div>
        <div className={styles.buttons}>
          <Button basic size="small" onClick={() => onGetMana()} className={styles.getMana}>
            <Mana showTooltip inline size="small" network={asset.network} primary />
            {t('asset_page.actions.get_mana')}
          </Button>
          <Button basic size="small" onClick={() => onBuyWithCard(asset)}>
            <Icon name="credit card outline" />
            {t('asset_page.actions.buy_with_card')}
          </Button>
        </div>
      </Card.Content>
    </Card>
  )
}

export default React.memo(NotEnoughMana)
