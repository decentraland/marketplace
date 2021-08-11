import { BodyShape, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isUnisex, isGender } from '../../../modules/nft/wearable/utils'
import { Props } from './WearableTags.types'
import './WearableTags.css'

const WearableTags = (props: Props) => {
  const { asset } = props
  const wearable = asset.data.wearable!
  return (
    <div className="WearableTags tags">
      <div
        title={t(`wearable.rarity_tooltip.${wearable.rarity}`)}
        className="rarity"
        style={{ backgroundColor: Rarity.getColor(wearable.rarity) }}
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
