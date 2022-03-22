import { NFTCategory } from '@dcl/schemas'
import classnames from 'classnames'
import { AssetType } from '../../../modules/asset/types'
import RarityBadge from '../../RarityBadge'
import GenderBadge from '../../GenderBadge'
import { Props } from './EmoteTags.types'
import styles from './EmoteTags.module.css'

const EmoteTags = (props: Props) => {
  const { nft } = props
  const { rarity, bodyShapes } = nft.data.emote!
  return (
    <div className={classnames([styles.EmoteTags, 'tags'])}>
      <RarityBadge
        size="small"
        rarity={rarity}
        assetType={AssetType.NFT}
        category={NFTCategory.EMOTE}
        withTooltip={false}
      />
      <GenderBadge
        bodyShapes={bodyShapes}
        assetType={AssetType.NFT}
        withText={false}
      />
    </div>
  )
}

export default EmoteTags
