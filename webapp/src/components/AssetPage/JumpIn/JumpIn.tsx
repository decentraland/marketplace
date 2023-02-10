import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Badge } from 'decentraland-ui'
import { buildExplorerUrl } from '../../../modules/nft/parcel/utils'
import { Props } from './JumpIn.types'
import styles from './JumpIn.module.css'

const JumpIn = (props: Props) => {
  const { x, y, className, compact } = props

  return (
    <Badge className={classNames([styles.JumpIn, className])} color="#ff2d55">
      <a href={buildExplorerUrl(x, y)} target="_blank" rel="noopener noreferrer">
        {!compact ? t('asset_page.jump_in') : null}
        <i
          className={classNames(styles.jumpInIcon, {
            [styles.fullSize]: !compact
          })}
        />
      </a>
    </Badge>
  )
}

export default React.memo(JumpIn)
