import React from 'react'
import { Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Rarity } from '@dcl/schemas'
import { Props } from './RarityBadge.types'

import styles from './RarityBadge.module.css'

const RarityBadge = ({ rarity, onClick }: Props) => {
  return (
    <Popup
      position="top center"
      content={t(`wearable.rarity_tooltip.${rarity}`)}
      trigger={
        <div
          className={styles.badge}
          style={{
            backgroundColor: Rarity.getColor(rarity)
          }}
          onClick={onClick}
        >
          <span className={styles.text}>{t(`wearable.rarity.${rarity}`)}</span>
        </div>
      }
    />
  )
}

export default React.memo(RarityBadge)
