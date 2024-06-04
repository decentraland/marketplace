import React, { useMemo } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import LinkedIconBadge from '../LinkedIconBadge'
import { Props } from './SmartBadge.types'
import './SmartBadge.css'

const SmartBadge = ({ assetType, clickable = true }: Props) => {
  const href = useMemo(
    () =>
      locations.browse({
        assetType: assetType,
        section: Section.WEARABLES,
        onlySmart: true
      }),
    [assetType]
  )

  return (
    <LinkedIconBadge
      className={classNames('SmartBadge', { clickable })}
      text={t('wearable.smart_badge')}
      icon="smart-wearable"
      href={clickable ? href : undefined}
    />
  )
}

export default React.memo(SmartBadge)
