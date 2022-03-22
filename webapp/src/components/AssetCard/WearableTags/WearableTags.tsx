import { BodyShape, NFTCategory } from '@dcl/schemas'
import { SmartIcon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import RarityBadge from '../../AssetPage/RarityBadge'
import { isUnisex, isGender } from '../../../modules/nft/wearable/utils'
import { AssetType } from '../../../modules/asset/types'
import { Props } from './WearableTags.types'
import './WearableTags.css'

const WearableTags = (props: Props) => {
  const { asset } = props
  const wearable = asset.data.wearable!
  return (
    <div className="WearableTags tags">
      <RarityBadge
        size="small"
        rarity={wearable.rarity}
        assetType={AssetType.NFT}
        category={NFTCategory.EMOTE}
      />
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
      {wearable.isSmart ? (
        <div className="icon smart" title={t(`wearable.smart`)}>
          <SmartIcon />
        </div>
      ) : null}
    </div>
  )
}

export default WearableTags
