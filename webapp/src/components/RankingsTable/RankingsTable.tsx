import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { EmoteCategory, Rarity, WearableCategory } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { HeaderMenu, Header, NotMobile, Table, Loader, Tabs, Dropdown, DropdownProps, Mobile } from 'decentraland-ui'
import {
  AnalyticsTimeframe,
  CollectorRank,
  CreatorRank,
  ItemRank,
  RankingEntities,
  RankingsFilters,
  RankingsSortBy
} from '../../modules/analytics/types'
import { useScrollSectionIntoView } from '../../modules/ui/utils'
import { convertToOutputString } from '../../utils/output'
import { InfoTooltip } from '../InfoTooltip'
import { TimeframeSelector } from '../Rankings/TimeframeSelector'
import { RankingCollectorRow } from './RankingCollectorRow'
import { RankingCreatorRow } from './RankingCreatorRow'
import { RankingItemRow } from './RankingItemRow'
import { parseURLHash } from './utils'
import { Props } from './RankingsTable.types'
import './RankingsTable.css'

const ALL_FILTER = 'all'
const INITIAL_FILTERS = {
  sortBy: RankingsSortBy.MOST_VOLUME
}
const TABS_PREFIX = '#rankings-'

const RankingsTable = (props: Props) => {
  const { isLoading, onFetchRankings, data } = props

  const history = useHistory()
  const location = useLocation()
  const parsedURL = location.hash.includes(TABS_PREFIX) ? parseURLHash(location.hash) : null

  const [currentEntity, setCurrentEntity] = useState(parsedURL ? parsedURL.entity : RankingEntities.WEARABLES)
  const [currentTimeframe, setCurrentTimeframe] = useState(parsedURL ? parsedURL.timeframe : AnalyticsTimeframe.WEEK)
  const [currentFilters, setCurrentFilters] = useState<RankingsFilters>(parsedURL ? { sortBy: parsedURL.sortBy } : INITIAL_FILTERS)
  const rankingsSectionRef = useRef<HTMLDivElement>(null)

  useScrollSectionIntoView(rankingsSectionRef, TABS_PREFIX)

  useEffect(() => {
    onFetchRankings(currentEntity, currentTimeframe, currentFilters)
  }, [onFetchRankings, currentTimeframe, currentEntity, currentFilters])

  const registerHandleFilterChange =
    (filterName: keyof RankingsFilters) =>
    (_event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
      setCurrentFilters({
        ...currentFilters,
        [filterName]: value !== ALL_FILTER ? value : undefined
      })
      if (filterName === 'sortBy') {
        history.replace({
          pathname: location.pathname,
          hash: `${TABS_PREFIX}${currentEntity}-${currentTimeframe}-${convertToOutputString(value)}`
        })
      }
    }

  const handleTabChange = (entity: RankingEntities) => {
    setCurrentEntity(entity)
    setCurrentFilters({ ...INITIAL_FILTERS, sortBy: currentFilters.sortBy })
    history.replace({
      pathname: location.pathname,
      hash: `${TABS_PREFIX}${entity}-${currentTimeframe}-${currentFilters.sortBy}`
    })
  }

  const handleTimeframeSelectorChange = (timeframe: AnalyticsTimeframe) => {
    setCurrentTimeframe(timeframe)
    history.replace({
      pathname: location.pathname,
      hash: `${TABS_PREFIX}${currentEntity}-${timeframe}-${currentFilters.sortBy}`
    })
  }

  const renderTableTabs = () => {
    return (
      <div className="rankings-card-tabs">
        <Tabs isFullscreen>
          <Tabs.Left>
            {Object.values(RankingEntities).map(entity => (
              <Tabs.Tab key={entity} active={currentEntity === entity} onClick={() => handleTabChange(entity)}>
                <div id={entity}>{t(`home_page.analytics.rankings.${entity}.tab_title`)}</div>
              </Tabs.Tab>
            ))}
          </Tabs.Left>
        </Tabs>
        {(currentEntity === RankingEntities.WEARABLES || currentEntity === RankingEntities.EMOTES) && (
          <>
            <Dropdown
              value={currentFilters.category || ALL_FILTER}
              direction="right"
              options={[
                ALL_FILTER,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                ...Object.values(currentEntity === RankingEntities.EMOTES ? EmoteCategory.schema.enum : WearableCategory.schema.enum)
              ].map(category => ({
                value: category as string,
                text:
                  category === ALL_FILTER
                    ? t('home_page.analytics.rankings.all_categories')
                    : t(`${currentEntity === RankingEntities.EMOTES ? 'emote' : 'wearable'}.category.${convertToOutputString(category)}`)
              }))}
              onChange={registerHandleFilterChange('category')}
            />
            <Dropdown
              value={currentFilters.rarity || ALL_FILTER}
              direction="right"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              options={[ALL_FILTER, ...Rarity.getRarities()].map(rarity => ({
                value: rarity,
                text: rarity === ALL_FILTER ? t('home_page.analytics.rankings.all_rarities') : t(`rarity.${convertToOutputString(rarity)}`)
              }))}
              onChange={registerHandleFilterChange('rarity')}
            />
          </>
        )}
      </div>
    )
  }

  const renderEntityDropdown = () => {
    return (
      <Dropdown
        className="rankings-entity-dropdown"
        defaultValue={RankingEntities.WEARABLES}
        value={currentEntity}
        direction="right"
        options={[...Object.values(RankingEntities)].map(entity => ({
          value: entity as string,
          text: t(`home_page.analytics.rankings.${entity}.tab_title`)
        }))}
        onChange={(_event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => handleTabChange(value as RankingEntities)}
      />
    )
  }

  const getTableHeader = () => {
    switch (currentEntity) {
      case RankingEntities.EMOTES:
      case RankingEntities.WEARABLES: {
        const label = currentEntity === RankingEntities.EMOTES ? 'emotes' : 'wearables'
        return (
          <Table.Header>
            <Table.Row>
              <Mobile>
                <Table.HeaderCell>
                  <span>{t(`home_page.analytics.rankings.${label}.item`)}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.total_volume')}</span>
                </Table.HeaderCell>
              </Mobile>
              <NotMobile>
                <Table.HeaderCell>
                  <span>{t(`home_page.analytics.rankings.${label}.item`)}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.category')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.rarity')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>{t(`home_page.analytics.rankings.${label}.items_sold`)}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>
                    {t('home_page.analytics.rankings.total_volume')}
                    <InfoTooltip content={t('home_page.analytics.rankings.total_volume_tooltip')} />
                  </span>
                </Table.HeaderCell>
              </NotMobile>
            </Table.Row>
          </Table.Header>
        )
      }
      case RankingEntities.CREATORS:
        return (
          <Table.Header>
            <Table.Row>
              <Mobile>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.items.creator')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {' '}
                  <span>{t('home_page.analytics.rankings.total_volume_sales')}</span>
                </Table.HeaderCell>
              </Mobile>
              <NotMobile>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.creators.creator')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.creators.collections')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.creators.items_sold')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>
                    {t('home_page.analytics.rankings.creators.unique_collectors')}
                    <InfoTooltip content={t('home_page.analytics.rankings.creators.unique_collectors_tooltip')} />
                  </span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>
                    {t('home_page.analytics.rankings.creators.total_volume_sales')}
                    <InfoTooltip content={t('home_page.analytics.rankings.creators.total_volume_sales_tooltip')} />
                  </span>
                </Table.HeaderCell>
              </NotMobile>
            </Table.Row>
          </Table.Header>
        )
      case RankingEntities.COLLECTORS:
        return (
          <Table.Header>
            <Table.Row>
              <Mobile>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.collectors.collector')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.collectors.total_spent')}</span>
                </Table.HeaderCell>
              </Mobile>
              <NotMobile>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.collectors.collector')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>{t('home_page.analytics.rankings.collectors.items_bought')}</span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>
                    {t('home_page.analytics.rankings.collectors.creators_supported')}
                    <InfoTooltip content={t('home_page.analytics.rankings.collectors.creators_supported_tooltip')} />
                  </span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>
                    {t('home_page.analytics.rankings.collectors.unique_items_bought')}
                    <InfoTooltip content={t('home_page.analytics.rankings.collectors.unique_items_bought_tooltip')} />
                  </span>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <span>
                    {t('home_page.analytics.rankings.collectors.total_spent')}
                    <InfoTooltip content={t('home_page.analytics.rankings.collectors.total_spent_tooltip')} />
                  </span>
                </Table.HeaderCell>
              </NotMobile>
            </Table.Row>
          </Table.Header>
        )
      default:
        break
    }
  }

  const renderMobileTableHeader = () => {
    const label = currentEntity === RankingEntities.EMOTES ? 'emotes' : 'wearables'
    let header = <span>{t(`home_page.analytics.rankings.${label}.item`)}</span>
    if (currentEntity === RankingEntities.CREATORS) {
      header = <span>{t('home_page.analytics.rankings.creators.creator')}</span>
    } else if (currentEntity === RankingEntities.COLLECTORS) {
      header = <span>{t('home_page.analytics.rankings.collectors.collector')}</span>
    }
    return (
      <div className="table-header">
        <span>{header}</span>
        <span>{t('home_page.analytics.rankings.total_volume')}</span>
      </div>
    )
  }

  const renderEmptyState = () => {
    return (
      <div className="empty-state-container">
        <span className="empty-state-title">{t('home_page.analytics.rankings.no_results_title')}</span>
        <span className="empty-state-subtitle">
          <T
            id="home_page.analytics.rankings.no_results_action"
            values={{
              link: (
                <div className="empty-state-action-button" onClick={() => setCurrentFilters(INITIAL_FILTERS)}>
                  {t('home_page.analytics.rankings.clear_filters')}
                </div>
              )
            }}
          />
        </span>
      </div>
    )
  }

  const renderTableContent = () => {
    if (!data) {
      return null
    }
    let content
    switch (currentEntity) {
      case RankingEntities.EMOTES:
      case RankingEntities.WEARABLES:
        content = (data as ItemRank[]).map(entity => <RankingItemRow key={entity.id} entity={entity} isLoading={isLoading} />)
        break
      case RankingEntities.CREATORS:
        content = (data as CreatorRank[])?.map(entity => <RankingCreatorRow key={entity.id} entity={entity} isLoading={isLoading} />)
        break
      case RankingEntities.COLLECTORS:
        content = (data as CollectorRank[])?.map(entity => <RankingCollectorRow key={entity.id} entity={entity} isLoading={isLoading} />)
        break
    }

    return (
      <>
        <Mobile>
          <>
            {renderMobileTableHeader()}
            {content}
          </>
        </Mobile>
        <NotMobile>
          <Table basic="very">
            {getTableHeader()}
            <Table.Body>{content}</Table.Body>
          </Table>
        </NotMobile>
      </>
    )
  }

  return (
    <div className="RankingsTable" ref={rankingsSectionRef}>
      <HeaderMenu>
        <HeaderMenu.Left>
          <Header>{t('home_page.analytics.rankings.title')}</Header>
          <span className="subtitle">{t('home_page.analytics.rankings.subtitle')}</span>
        </HeaderMenu.Left>
        <HeaderMenu.Right>
          <Dropdown
            className="sort-by-dropdown"
            text={t(`home_page.analytics.rankings.${currentFilters.sortBy}`)}
            direction="right"
            options={Object.values(RankingsSortBy).map(sortOption => ({
              value: sortOption as string,
              text: t(`home_page.analytics.rankings.${sortOption}`)
            }))}
            onChange={registerHandleFilterChange('sortBy')}
          />
          <TimeframeSelector value={currentTimeframe} onChange={handleTimeframeSelectorChange} />
        </HeaderMenu.Right>
      </HeaderMenu>
      <div className="rankings-card">
        <NotMobile>{renderTableTabs()}</NotMobile>
        <Mobile>{renderEntityDropdown()}</Mobile>

        {isLoading ? <Loader active size="large" /> : data && data.length > 0 ? renderTableContent() : renderEmptyState()}
      </div>
    </div>
  )
}

export default React.memo(RankingsTable)
