import React, { useEffect, useState } from 'react'
import {
  Button,
  HeaderMenu,
  Header,
  Stats,
  Icon,
  Loader,
  Mana
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AnalyticsTimeframe } from '../../modules/analytics/types'
import { Props } from './AnalyticsVolumeDayData.types'
import { formatAnalyticsVolume, formatDailySales } from './utils'
import './AnalyticsVolumeDayData.css'

const AnalyticsVolumeDayData = (props: Props) => {
  const { isLoading, data, onFetchVolumeData } = props

  const [currentTimeframe, setCurrentTimeframe] = useState(
    AnalyticsTimeframe.WEEK
  )

  useEffect(() => {
    onFetchVolumeData(currentTimeframe)
  }, [onFetchVolumeData, currentTimeframe])

  return (
    <div className="AnalyticsVolumeDayData">
      <HeaderMenu>
        <HeaderMenu.Left>
          <Header>{t('home_page.analytics.volume.title')}</Header>
        </HeaderMenu.Left>
        <HeaderMenu.Right>
          <Button
            className={
              currentTimeframe === AnalyticsTimeframe.WEEK ? 'active' : ''
            }
            basic
            onClick={() => setCurrentTimeframe(AnalyticsTimeframe.WEEK)}
          >
            {t('home_page.analytics.volume.seven_days')}
          </Button>
          <Button
            className={
              currentTimeframe === AnalyticsTimeframe.MONTH ? 'active' : ''
            }
            basic
            onClick={() => setCurrentTimeframe(AnalyticsTimeframe.MONTH)}
          >
            {t('home_page.analytics.volume.thirty_days')}
          </Button>
          <Button
            className={
              currentTimeframe === AnalyticsTimeframe.ALL ? 'active' : ''
            }
            basic
            onClick={() => setCurrentTimeframe(AnalyticsTimeframe.ALL)}
          >
            {t('home_page.analytics.volume.all')}
          </Button>
        </HeaderMenu.Right>
      </HeaderMenu>
      <div className="stats-card">
        {!isLoading && data ? (
          <>
            <div className="stats-container">
              <Icon className="stat-icon" name="tag" />
              <Stats title={t('home_page.analytics.volume.total_sales')}>
                <div className="stats">
                  {data.sales}
                  <span className="stats-usd">
                    {formatDailySales(data.sales, currentTimeframe)}
                  </span>
                </div>
              </Stats>
            </div>
            <div className="stats-container">
              <Icon className="stat-icon" name="clone outline" />
              <Stats title={t('home_page.analytics.volume.total_volume')}>
                <div className="stats">
                  <Mana>{formatAnalyticsVolume(data.volume)}</Mana>
                  <span className="stats-usd">
                    ${formatAnalyticsVolume(data.volumeUSD)}
                  </span>
                </div>
              </Stats>
            </div>
            <div className="stats-container">
              <Icon className="stat-icon" name="star" />
              <Stats title={t('home_page.analytics.volume.creators_earnings')}>
                <div className="stats">
                  <Mana>{formatAnalyticsVolume(data.creatorsEarnings)}</Mana>
                  <span className="stats-usd">
                    ${formatAnalyticsVolume(data.creatorsEarningsUSD)}
                  </span>
                </div>
              </Stats>
            </div>
            <div className="stats-container">
              <Icon className="stat-icon" name="balance scale" />
              <Stats title={t('home_page.analytics.volume.dao_revenue')}>
                <div className="stats">
                  <Mana>{formatAnalyticsVolume(data.daoEarnings)}</Mana>
                  <span className="stats-usd">
                    ${formatAnalyticsVolume(data.daoEarningsUSD)}
                  </span>
                </div>
              </Stats>
            </div>
          </>
        ) : (
          <Loader size="medium" active />
        )}
      </div>
    </div>
  )
}

export default React.memo(AnalyticsVolumeDayData)
