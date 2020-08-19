import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { BodyShape, RARITY_COLOR } from '../../../modules/nft/wearable/types'
import { isUnisex, isGender } from '../../../modules/nft/wearable/utils'
import { Props } from './WearableTags.types'
import './WearableTags.css'

const WearableTags = (props: Props) => {
  const { nft } = props
  const wearable = nft.data.wearable!
  return (
    <div className="WearableTags tags">
      <div
        title={t(`wearable.rarity_tooltip.${wearable.rarity}`)}
        className="rarity"
        style={{ backgroundColor: RARITY_COLOR[wearable.rarity] }}
      >
        {t(`wearable.rarity.${wearable.rarity}`)}
      </div>
      <div
        className={'icon ' + wearable.category}
        title={t(`wearable.category.${wearable.category}`)}
      />
      {isUnisex(wearable) ? (
        <div className="icon Unisex" title={t('wearable.body_shape.unisex')} />
      ) : (
        <div
          className={'icon ' + wearable.bodyShapes[0]}
          title={
            isGender(wearable, BodyShape.MALE)
              ? t('wearable.body_shape.male')
              : t('wearable.body_shape.female')
          }
        />
      )}
    </div>
  )
}

export default WearableTags
