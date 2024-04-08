import { RarityBadge } from 'decentraland-dapps/dist/containers/RarityBadge'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../../modules/asset/types'
import { isCatalogItem, isNFT } from '../../../modules/asset/utils'
import { Section } from '../../../modules/vendor/decentraland'
import SmartBadge from '../../AssetPage/SmartBadge'
import GenderBadge from '../../GenderBadge/GenderBadge'
import { Props } from './WearableTags.types'
import './WearableTags.css'

const WearableTags = (props: Props) => {
  const { asset } = props
  const { rarity, category, bodyShapes, isSmart } = asset.data.wearable!

  return (
    <div className="WearableTags tags">
      <RarityBadge size="small" rarity={rarity} withTooltip={false} />
      {!isCatalogItem(asset) && <div className={'icon ' + category} title={t(`wearable.category.${category}`)} />}
      {!isCatalogItem(asset) && (
        <GenderBadge bodyShapes={bodyShapes} assetType={AssetType.NFT} withText={false} section={Section.WEARABLES} />
      )}
      {isSmart ? <SmartBadge assetType={isNFT(asset) ? AssetType.NFT : AssetType.ITEM} clickable={false} /> : null}
    </div>
  )
}

export default WearableTags
