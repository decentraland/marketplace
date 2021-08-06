import React, { useCallback } from 'react'
import { Rarity } from '@dcl/schemas'
import { Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland/routing/types'
import { Props } from './WearableRarity.types'
import styles from './WearableRarity.module.css'

const WearableRarity = (props: Props) => {
  const { type, wearable, onNavigate } = props

  const handleRarityClick = useCallback(() => {
    if (wearable) {
      onNavigate(
        locations.browse({
          assetType: type,
          section: Section.WEARABLES,
          wearableRarities: [wearable.rarity]
        })
      )
    }
  }, [wearable, type, onNavigate])

  return wearable ? (
    <Popup
      position="top center"
      content={t(`wearable.rarity_tooltip.${wearable.rarity}`)}
      trigger={
        <div
          className={styles.rarity}
          style={{
            backgroundColor: Rarity.getColor(wearable.rarity)
          }}
          onClick={handleRarityClick}
        >
          {t(`wearable.rarity.${wearable.rarity}`)}
        </div>
      }
    />
  ) : null
}

export default React.memo(WearableRarity)
