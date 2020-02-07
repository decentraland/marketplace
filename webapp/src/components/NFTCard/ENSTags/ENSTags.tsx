import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ENSTags.types'
import './ENSTags.css'

const ENSTags = (_: Props) => {
  return (
    <div className="ENSTags tags">
      <div className="badge">{t('global.ens')}</div>
    </div>
  )
}

export default ENSTags
