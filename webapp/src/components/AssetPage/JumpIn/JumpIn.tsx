import React from 'react'
import classNames from 'classnames'
import { Badge } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { buildExplorerUrl } from '../../../modules/nft/parcel/utils'
import { Props } from './JumpIn.types'
import styles from './JumpIn.module.css'

const JumpIn = (props: Props) => {
  const { x, y, className } = props

  return (
    <Badge className={classNames([styles.JumpIn, className])} color="#ff2d55">
      <a
        href={buildExplorerUrl(x, y)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('asset_page.jump_in')}
        <i className={styles.jumpInIcon} />
      </a>
    </Badge>
  )
}

export default React.memo(JumpIn)
