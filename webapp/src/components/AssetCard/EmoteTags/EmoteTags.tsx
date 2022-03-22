import { NFTCategory } from '@dcl/schemas'
import classnames from 'classnames'
import { Props } from './EmoteTags.types'
import styles from './EmoteTags.module.css'
import { AssetType } from '../../../modules/asset/types'
import RarityBadge from '../../AssetPage/RarityBadge'

const EmoteTags = (props: Props) => {
  const { nft } = props
  const { rarity } = nft.data.emote!
  return (
    <div className={classnames([styles.EmoteTags, 'tags'])}>
      <RarityBadge
        size="small"
        rarity={rarity}
        assetType={AssetType.NFT}
        category={NFTCategory.EMOTE}
      />
    </div>
  )
}

export default EmoteTags
