import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header, Popup, Stats } from 'decentraland-ui'
import { Chip } from '../../Chip'
import {
  Props,
  SmartWearableRequiredPermission
} from './RequiredPermissions.types'
import styles from './RequiredPermissions.module.css'

const RequiredPermissions = ({ asset }: Props) => {
  const [requiredPermissions, setRequiredPermissions] = useState<string[]>([])

  useEffect(() => {
    if (item.category === NFTCategory.WEARABLE && item.data.wearable?.isSmart) {
      getSmartWearableRequiredPermissions(item.urn).then(
        requiredPermissions => {
          setRequiredPermissions(requiredPermissions)
        }
      )
    }
  }, [item])

  return (
    <Stats title="" className={styles.RequiredPermissions}>
      <Header sub className={styles.title}>
        {t('smart_wearable.required_permission.title')}
        <Popup
          className={styles.periodsTooltip}
          content={t('smart_wearable.required_permission.tooltip_info', {
            learn_more: (
              <a
                href="https://docs.decentraland.org/creator/development-guide/sdk7/scene-metadata/#required-permissions"
                target="_blank"
                rel="noreferrer"
              >
                {t('global.learn_more')}
              </a>
            )
          })}
          trigger={<i className={styles.tooltipInfo} />}
          position="top center"
          on="hover"
          hoverable
        />
      </Header>
      <div className={styles.container}>
        {Object.values(SmartWearableRequiredPermission).map(
          (requiredPermission, i) => (
            <Chip
              key={`${requiredPermission}-${i}`}
              className={styles.permission}
              text={t(
                `smart_wearable.required_permission.${requiredPermission}`
              )}
            />
          )
        )}
      </div>
    </Stats>
  )
}

export default React.memo(RequiredPermissions)
