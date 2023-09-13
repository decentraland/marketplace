import React, { useEffect } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header, Popup, Stats } from 'decentraland-ui'
import { Chip } from '../../Chip'
import { Props } from './RequiredPermissions.types'
import styles from './RequiredPermissions.module.css'

const RequiredPermissions = (props: Props) => {
  let {
    asset,
    isLoading,
    hasFetched,
    requiredPermissions,
    onFetchRequiredPermissions
  } = props

  useEffect(() => {
    if (requiredPermissions.length === 0 && !isLoading && !hasFetched)
      onFetchRequiredPermissions(asset)
  }, [
    asset,
    isLoading,
    hasFetched,
    onFetchRequiredPermissions,
    requiredPermissions.length
  ])

  return requiredPermissions.length > 0 ? (
    <Stats title="" className={styles.RequiredPermissions}>
      <Header sub className={styles.title}>
        {t('smart_wearable.required_permission.title', {
          count: requiredPermissions.length
        })}
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
        {requiredPermissions.map((requiredPermission, i) => (
          <Chip
            key={`${requiredPermission}-${i}`}
            className={styles.permission}
            text={t(
              `smart_wearable.required_permission.${requiredPermission.toLowerCase()}`
            )}
          />
        ))}
      </div>
    </Stats>
  ) : null
}

export default React.memo(RequiredPermissions)
