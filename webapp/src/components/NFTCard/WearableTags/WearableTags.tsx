import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { BodyShape, RARITY_COLOR } from '../../../modules/nft/wearable/types'
import { isUnisex, isGender } from '../../../modules/nft/wearable/utils'
import { Props } from './WearableTags.types'
import './WearableTags.css'

const WearableTags = (props: Props) => {
  const { nft } = props
  return (
    <div className="WearableTags tags">
      <div
        title={t(`wearable.rarity_tooltip.${nft.wearable!.rarity}`)}
        className="rarity"
        style={{ backgroundColor: RARITY_COLOR[nft.wearable!.rarity] }}
      >
        {t(`wearable.rarity.${nft.wearable!.rarity}`)}
      </div>
      <div
        className={'icon ' + nft.wearable!.category}
        title={t(`wearable.category.${nft.wearable!.category}`)}
      />
      {isUnisex(nft) ? (
        <div className="icon Unisex" title={t('wearable.body_shape.unisex')} />
      ) : (
        <div
          className={'icon ' + nft.wearable!.bodyShapes[0]}
          title={
            isGender(nft, BodyShape.MALE)
              ? t('wearable.body_shape.male')
              : t('wearable.body_shape.female')
          }
        />
      )}
    </div>
  )
}

export default WearableTags
