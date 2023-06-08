import { NFTCategory } from '@dcl/schemas'
import { SmartIcon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Section } from '../../../modules/vendor/decentraland'
import RarityBadge from '../../RarityBadge'
import GenderBadge from '../../GenderBadge/GenderBadge'
import { AssetType } from '../../../modules/asset/types'
import { isCatalogItem } from '../../../modules/asset/utils'
import { Props } from './WearableTags.types'
import './WearableTags.css'

const WearableTags = (props: Props) => {
  const { asset } = props
  const { rarity, category, bodyShapes, isSmart } = asset.data.wearable!

  return (
    <div className="WearableTags tags">
      <RarityBadge
        size="small"
        rarity={rarity}
        assetType={AssetType.NFT}
        category={NFTCategory.EMOTE}
        withTooltip={false}
      />
      {!isCatalogItem(asset) && (
        <div
          className={'icon ' + category}
          title={t(`wearable.category.${category}`)}
        />
      )}
      {!isCatalogItem(asset) && (
        <GenderBadge
          bodyShapes={bodyShapes}
          assetType={AssetType.NFT}
          withText={false}
          section={Section.WEARABLES}
        />
      )}
      {isSmart ? (
        <div className="icon smart" title={t(`wearable.smart`)}>
          <SmartIcon />
        </div>
      ) : null}
    </div>
  )
}

export default WearableTags
