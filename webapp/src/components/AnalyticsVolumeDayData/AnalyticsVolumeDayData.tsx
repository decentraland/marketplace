import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import {
  Button,
  HeaderMenu,
  Header,
  Stats,
  Icon,
  Loader,
  Mana,
  Popup,
  SemanticICONS
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  AnalyticsTimeframe,
  AnalyticsVolumeData
} from '../../modules/analytics/types'
import { Props } from './AnalyticsVolumeDayData.types'
import { formatAnalyticsVolume, formatDailySales } from './utils'
import './AnalyticsVolumeDayData.css'

const StatSections = [
  {
    key: 'total_sales',
    icon: 'tag',
    isMana: false,
    getData: (data: AnalyticsVolumeData) => data.sales,
    getUSDData: (data: AnalyticsVolumeData) => data.sales,
    formatUSDVolume: (number: number, currentTimeframe: AnalyticsTimeframe) =>
      formatDailySales(number, currentTimeframe)
  },
  {
    key: 'total_volume',
    icon: 'chart line',
    isMana: true,
    getData: (data: AnalyticsVolumeData) => data.volume,
    getUSDData: (data: AnalyticsVolumeData) => data.volumeUSD,
    formatUSDVolume: (number: number) => `$${formatAnalyticsVolume(number)}`
  },
  {
    key: 'creators_earnings',
    icon: 'star',
    isMana: true,
    getData: (data: AnalyticsVolumeData) => data.creatorsEarnings,
    getUSDData: (data: AnalyticsVolumeData) => data.creatorsEarningsUSD,
    formatUSDVolume: (number: number) => `$${formatAnalyticsVolume(number)}`
  },
  {
    key: 'dao_revenue',
    icon: 'balance scale',
    isMana: true,
    getData: (data: AnalyticsVolumeData) => data.daoEarnings,
    getUSDData: (data: AnalyticsVolumeData) => data.daoEarningsUSD,
    formatUSDVolume: (number: number) => `$${formatAnalyticsVolume(number)}`
  }
]

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
          <div>
            <Header>{t('home_page.analytics.volume.title')}</Header>
            <Header sub>{t('home_page.analytics.volume.subtitle')}</Header>
          </div>
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
            {StatSections.map(statSection => (
              <div className="stats-container">
                <Icon
                  className="stat-icon"
                  name={statSection.icon as SemanticICONS}
                />
                <Stats title="">
                  <div className="stat-title-container">
                    <Header sub>
                      {t(`home_page.analytics.volume.${statSection.key}`)}
                    </Header>
                    <Popup
                      content={t(
                        `home_page.analytics.volume.${statSection.key}_tooltip`
                      )}
                      position="top center"
                      trigger={<div className="info-logo" />}
                      on="hover"
                    />
                  </div>
                  <div className="stats">
                    {statSection.isMana ? (
                      <Mana>
                        <CountUp
                          end={statSection.getData(data)}
                          formattingFn={formatAnalyticsVolume}
                        />
                      </Mana>
                    ) : (
                      <CountUp
                        end={statSection.getData(data)}
                        formattingFn={formatAnalyticsVolume}
                      />
                    )}
                    <span className="stats-usd">
                      <CountUp
                        end={statSection.getUSDData(data)}
                        formattingFn={number =>
                          statSection.formatUSDVolume(number, currentTimeframe)
                        }
                      />
                    </span>
                  </div>
                </Stats>
              </div>
            ))}
          </>
        ) : (
          <Loader size="medium" active />
        )}
      </div>
    </div>
  )
}

export default React.memo(AnalyticsVolumeDayData)
