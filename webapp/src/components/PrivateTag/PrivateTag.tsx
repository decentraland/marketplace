import React from 'react'
import classnames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './PrivateTag.types'
import styles from './PrivateTag.module.css'

const PrivateTag = (props: Props) => {
  return (
    <div className={classnames(styles.private, props.className)} data-testid={props['data-testid']}>
      <div className={styles.icon}></div>
      {t('list_card.private')}
    </div>
  )
}

export default React.memo(PrivateTag)
