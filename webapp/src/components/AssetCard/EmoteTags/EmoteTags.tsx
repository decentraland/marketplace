import classNames from 'classnames'
import { RarityBadge } from 'decentraland-dapps/dist/containers/RarityBadge'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Popup } from 'decentraland-ui'
import socialSrc from '../../../images/emotes/social.svg'
import soundSrc from '../../../images/emotes/sound.svg'
import { Props } from './EmoteTags.types'
import styles from './EmoteTags.module.css'

const EmoteTags = (props: Props) => {
  const { asset } = props
  const { rarity, loop, hasSound, outcomeType } = asset.data.emote || {}
  const isSocial = !!outcomeType

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
      {isSocial && (
        <div className={styles.social}>
          <img src={socialSrc} alt="social" />
          {t('emote.social')}
        </div>
      )}
    </div>
  )
}

export default EmoteTags
