import classNames from 'classnames'
import { RarityBadge } from 'decentraland-dapps/dist/containers/RarityBadge'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Popup } from 'decentraland-ui'
import soundSrc from '../../../images/emotes/sound.svg'
import { Props } from './EmoteTags.types'
import styles from './EmoteTags.module.css'

const EmoteTags = (props: Props) => {
  const { asset } = props
  const { rarity, loop, hasSound } = asset.data.emote || {}

  return (
    <div className={classNames([styles.EmoteTags, 'tags'])}>
      <div className={styles.badges}>
        {rarity ? <RarityBadge size="small" rarity={rarity} withTooltip={false} /> : null}
        {loop !== undefined ? (
          <Popup
            position="top center"
            content={<T id={`emote.play_mode.${loop ? 'loop' : 'simple'}`} />}
            trigger={
              <div className={styles.PlayModeSmallBadge}>
                <span className={classNames(styles.PlayIcon, loop ? styles.PlayLoop : styles.PlayOnce)}></span>
              </div>
            }
          />
        ) : null}
      </div>
      {hasSound && (
        <div className={styles.sound}>
          <img src={soundSrc} alt="with sound" />
        </div>
      )}
    </div>
  )
}

export default EmoteTags
