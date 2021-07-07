import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { buildExplorerUrl } from '../../../modules/nft/parcel/utils'
import { Badge } from '../Badge'
import { Props } from './JumpIn.types'
import styles from './JumpIn.module.css'

const JumpIn = (props: Props) => {
  const { x, y, className } = props

  const classes = [styles.jumpIn]
  if (className) {
    classes.push(className)
  }

  return (
    <Badge className={classes.join(' ')} color="#ff2d55">
      <a
        href={buildExplorerUrl(x, y)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('nft_page.jump')}&nbsp;{t('nft_page.in')}
        <i className={styles.jumpInIcon} />
      </a>
    </Badge>
  )
}

export default React.memo(JumpIn)
