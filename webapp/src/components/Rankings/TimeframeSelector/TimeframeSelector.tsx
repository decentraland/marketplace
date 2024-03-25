import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { AnalyticsTimeframe } from '../../../modules/analytics/types'
import { Props } from './TimeframeSelector.types'
import './TimeframeSelector.css'

const TimeframeSelector = (props: Props) => {
  const { value, onChange } = props

  return (
    <div className="TimeframeSelector">
      <Button className={value === AnalyticsTimeframe.WEEK ? 'active' : ''} basic onClick={() => onChange(AnalyticsTimeframe.WEEK)}>
        {t('home_page.analytics.volume.seven_days')}
      </Button>
      <Button className={value === AnalyticsTimeframe.MONTH ? 'active' : ''} basic onClick={() => onChange(AnalyticsTimeframe.MONTH)}>
        {t('home_page.analytics.volume.thirty_days')}
      </Button>
      <Button className={value === AnalyticsTimeframe.ALL ? 'active' : ''} basic onClick={() => onChange(AnalyticsTimeframe.ALL)}>
        {t('home_page.analytics.volume.all')}
      </Button>
    </div>
  )
}

export default React.memo(TimeframeSelector)
