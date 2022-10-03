import { NFTCategory } from '@dcl/schemas'
import { Popup } from 'decentraland-ui'
import classNames from 'classnames'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../../modules/asset/types'
import RarityBadge from '../../RarityBadge'
import { Props } from './EmoteTags.types'
import styles from './EmoteTags.module.css'

const EmoteTags = (props: Props) => {
  const { nft } = props
  const { rarity, loop } = nft.data.emote!
  return (
    <div className={classNames([styles.EmoteTags, 'tags'])}>
      <RarityBadge
        size="small"
        rarity={rarity}
        assetType={AssetType.NFT}
        category={NFTCategory.EMOTE}
        withTooltip={false}
      />

      <Popup
        position="top center"
        content={<T id={`emote.play_mode.${loop ? 'loop' : 'simple'}`} />}
        trigger={
          <div className={styles.PlayModeSmallBadge}>
            <span
              className={classNames(
                styles.PlayIcon,
                loop ? styles.PlayLoop : styles.PlayOnce
              )}
            ></span>
          </div>
        }
      />
    </div>
  )
}

export default EmoteTags
