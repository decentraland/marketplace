import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { SmartIcon } from 'decentraland-ui'
import IconBadge from '../IconBadge'
import { Props } from './SmartBadge.types'
import './SmartBadge.css'

const SmartBadge = ({ onClick }: Props) => {
  return (
    <IconBadge
      className="SmartBadge"
      text={t('wearable.smart_badge')}
      onClick={onClick}
    >
      <SmartIcon />
    </IconBadge>
  )
}

export default React.memo(SmartBadge)
