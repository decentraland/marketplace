import { NFTCategory } from '@dcl/schemas'
import classNames from 'classnames'
import { AssetType } from '../../../modules/asset/types'
import RarityBadge from '../../RarityBadge'
import { Props } from './EmoteTags.types'
import styles from './EmoteTags.module.css'

const EmoteTags = (props: Props) => {
  const { asset } = props
  const { rarity } = asset.data.emote!

  return (
    <div className={classNames([styles.EmoteTags, 'tags'])}>
      <RarityBadge
        size="small"
        rarity={rarity}
        assetType={AssetType.NFT}
        category={NFTCategory.EMOTE}
        withTooltip={false}
      />
    </div>
  )
}

export default EmoteTags
