import React, { useMemo } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { SmartIcon } from 'decentraland-ui'
import { Section } from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import IconBadge from '../IconBadge'
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
    <IconBadge
      className={classNames('SmartBadge', { clickable })}
      text={t('wearable.smart_badge')}
      href={clickable ? href : undefined}
    >
      <SmartIcon />
    </IconBadge>
  )
}

export default React.memo(SmartBadge)
