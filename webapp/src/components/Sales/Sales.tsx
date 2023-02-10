import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header } from 'decentraland-ui'
import Activity from './Activity'
import Stats from './Stats'
import './Sales.css'

const Sales = () => {
  return (
    <div className="Sales">
      <div className="header-with-filter">
        <Header>{t('sales.stats')}</Header>
      </div>
      <Stats />
      <Activity />
    </div>
  )
}

export default React.memo(Sales)
