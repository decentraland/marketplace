import { memo } from 'react'
import { Icon, Popup } from 'decentraland-ui'
import { Props } from './Info.types'
import styles from './Info.module.css'

export const Info = ({ title, icon, popupContent, children }: Props) => (
  <div className={styles.info}>
    <div className={styles.infoTitle}>
      {title}
      {icon ? (
        popupContent ? (
          <Popup
            content={popupContent}
            position="top center"
            trigger={
              <Icon name={icon} size="small" className={styles.infoIcon} />
            }
          />
        ) : (
          <Icon name={icon} size="small" className={styles.infoIcon} />
        )
      ) : null}
    </div>
    <div className={styles.infoContent}>{children}</div>
  </div>
)

export default memo(Info)
