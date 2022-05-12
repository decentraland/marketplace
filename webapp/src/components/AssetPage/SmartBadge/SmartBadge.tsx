import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { SmartIcon } from 'decentraland-ui'
import IconBadge from '../IconBadge'
import { Props } from './SmartBadge.types'
import './SmartBadge.css'
import { Section } from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'

const SmartBadge = ({ assetType }: Props) => {
  
  const href = React.useMemo(() => locations.browse({
    assetType: assetType,
    section: Section.WEARABLES,
    onlySmart: true
  }), [assetType])

  return (
    <IconBadge
      className="SmartBadge"
      text={t('wearable.smart_badge')}
      href={href}
    >
      <SmartIcon />
    </IconBadge>
  )
}

export default React.memo(SmartBadge)
