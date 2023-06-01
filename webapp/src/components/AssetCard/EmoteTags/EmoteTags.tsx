import classNames from 'classnames'
import { NFTCategory } from '@dcl/schemas'
import { Popup } from 'decentraland-ui'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import { isNFT } from '../../../modules/asset/utils'
import { AssetType } from '../../../modules/asset/types'
import RarityBadge from '../../RarityBadge'
import { Props } from './EmoteTags.types'
import styles from './EmoteTags.module.css'

const EmoteTags = (props: Props) => {
  const { asset } = props
  const { rarity, loop } = asset.data.emote || {}

  return (
    <div className={classNames([styles.EmoteTags, 'tags'])}>
      {rarity ? (
        <RarityBadge
          size="small"
          rarity={rarity}
          assetType={AssetType.NFT}
          category={NFTCategory.EMOTE}
          withTooltip={false}
        />
      ) : null}
      {isNFT(asset) && loop !== undefined ? (
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
      ) : null}
    </div>
  )
}

export default EmoteTags
