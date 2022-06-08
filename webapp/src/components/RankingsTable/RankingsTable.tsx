import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HeaderMenu,
  Header,
  NotMobile,
  Table,
  Loader,
  Mana,
  Tabs,
  Dropdown,
  DropdownProps
} from 'decentraland-ui'
import { Network, NFTCategory, Rarity, WearableCategory } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'
import {
  AnalyticsTimeframe,
  CollectorRank,
  CreatorRank,
  ItemRank,
  RankingEntities,
  RankingsFilters,
  RankingsSortBy
} from '../../modules/analytics/types'
import { TimeframeSelector } from '../Rankings/TimeframeSelector'
import { AssetProvider } from '../AssetProvider'
import { AssetType } from '../../modules/asset/types'
import { formatWeiMANA } from '../../lib/mana'
import { locations } from '../../modules/routing/locations'
import RarityBadge from '../RarityBadge'
import { ManaToFiat } from '../ManaToFiat'
import { Props } from './RankingsTable.types'
import './RankingsTable.css'

const ALL_FILTER = 'all'

const RankingsTable = (props: Props) => {
  const { isLoading, onFetchRankings } = props

  const [currentEntity, setCurrentEntity] = useState(RankingEntities.ITEMS)
  const [currentFilters, setCurrentFilters] = useState<RankingsFilters>({
    sortBy: RankingsSortBy.MOST_VOLUME
  })
  const [currentTimeframe, setCurrentTimeframe] = useState(
    AnalyticsTimeframe.WEEK
  )

  useEffect(() => {
    onFetchRankings(currentEntity, currentTimeframe, currentFilters)
  }, [onFetchRankings, currentTimeframe, currentEntity, currentFilters])

  const registerHandleFilterChange = (filterName: keyof RankingsFilters) => (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    { value }: DropdownProps
  ) => {
    setCurrentFilters(prevValues => ({
      ...prevValues,
      [filterName]: value !== ALL_FILTER ? value : undefined
    }))
  }

  const renderTableTabs = () => {
    return (
      <div className="rankings-card-tabs">
        <Tabs isFullscreen>
          <Tabs.Left>
            {Object.values(RankingEntities).map(entity => (
              <Tabs.Tab
                key={entity}
                active={currentEntity === entity}
                onClick={() => setCurrentEntity(entity)}
              >
                {t(`home_page.analytics.rankings.${entity}.tab_title`)}
              </Tabs.Tab>
            ))}
          </Tabs.Left>
        </Tabs>
        {currentEntity === RankingEntities.ITEMS && (
          <>
            <Dropdown
              defaultValue={ALL_FILTER}
              direction="right"
              options={[
                ALL_FILTER,
                ...Object.values(WearableCategory.schema.enum)
              ].map(cat => ({
                value: cat as string,
                text:
                  cat === ALL_FILTER
                    ? t('home_page.analytics.rankings.items.all_categories')
                    : t(`wearable.category.${cat}`)
              }))}
              onChange={registerHandleFilterChange('category')}
            />
            <Dropdown
              defaultValue={ALL_FILTER}
              direction="right"
              options={[ALL_FILTER, ...Object.values(Rarity.schema.enum)].map(
                rarity => ({
                  value: rarity as string,
                  text:
                    rarity === ALL_FILTER
                      ? t('home_page.analytics.rankings.items.all_rarities')
                      : t(`rarity.${rarity}`)
                })
              )}
              onChange={registerHandleFilterChange('rarity')}
            />
          </>
        )}
      </div>
    )
  }

  const getTableHeader = () => {
    switch (currentEntity) {
      case RankingEntities.ITEMS:
        return (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.items.item')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.items.category')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.items.rarity')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.items.price')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.items.items_sold')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.total_volume')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )
      case RankingEntities.CREATORS:
        return (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.creators.creator')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.creators.collections')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.creators.items_sold')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.creators.unique_collectors')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.total_volume')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )
      case RankingEntities.COLLECTORS:
        return (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.collectors.collector')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.collectors.items_bought')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t(
                  'home_page.analytics.rankings.collectors.creators_supported'
                )}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t(
                  'home_page.analytics.rankings.collectors.unique_items_bought'
                )}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.analytics.rankings.collectors.total_spent')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )
      default:
        break
    }
  }

  const renderTableContent = () => {
    const { data } = props
    switch (currentEntity) {
      case RankingEntities.ITEMS:
        return (data as ItemRank[])?.map(entity => {
          return (
            <AssetProvider
              key={entity.id}
              type={AssetType.ITEM}
              contractAddress={entity.id.split('-')[0]}
              tokenId={entity.id.split('-')[1]}
            >
              {(item, order, isLoading) => {
                if (!isLoading && !item) {
                  return null
                }
                return (
                  <Table.Row>
                    <>
                      <Table.Cell width={5}>
                        {item ? (
                          <div className="rankings-item-cell">
                            <Link
                              to={locations.item(
                                item.contractAddress,
                                item.itemId
                              )}
                            >
                              <img
                                src={item.thumbnail}
                                alt={`${item.name}-thumbnail`}
                              />
                            </Link>

                            <div className="rankings-item-data">
                              <Link
                                to={locations.item(
                                  item.contractAddress,
                                  item.itemId
                                )}
                              >
                                {item.name}
                              </Link>

                              <span>
                                <T
                                  id="home_page.analytics.rankings.items.by_creator"
                                  values={{
                                    creator: (
                                      <span className="rankings-item-data-creator">
                                        <Link
                                          to={locations.account(item.creator)}
                                        >
                                          <Profile
                                            address={item.creator}
                                            textOnly
                                            inline={false}
                                          />
                                        </Link>
                                      </span>
                                    )
                                  }}
                                />
                              </span>
                            </div>
                          </div>
                        ) : isLoading ? (
                          <Loader active inline />
                        ) : null}
                      </Table.Cell>
                      <Table.Cell width={2}>
                        {item
                          ? t(
                              `wearable.category.${item.data.wearable?.category}`
                            )
                          : null}
                      </Table.Cell>
                      <Table.Cell width={2}>
                        {item ? (
                          <RarityBadge
                            size="small"
                            rarity={item.rarity}
                            assetType={AssetType.NFT}
                            category={NFTCategory.WEARABLE}
                            withTooltip={false}
                          />
                        ) : null}
                      </Table.Cell>
                      <Table.Cell width={2}>
                        {item ? (
                          <Mana network={item?.network} inline>
                            {formatWeiMANA(item?.price || order!.price)}
                          </Mana>
                        ) : null}
                      </Table.Cell>
                      <Table.Cell width={2}>
                        {item ? entity.sales : null}
                      </Table.Cell>
                      <Table.Cell>
                        {item ? (
                          <>
                            <Mana network={item?.network} inline>
                              {formatWeiMANA(entity.volume)}
                            </Mana>
                            <span className="rankings-fiat-price">
                              (<ManaToFiat mana={entity.volume} />)
                            </span>
                          </>
                        ) : null}
                      </Table.Cell>
                    </>
                  </Table.Row>
                )
              }}
            </AssetProvider>
          )
        })
      case RankingEntities.CREATORS:
        return (data as CreatorRank[])?.map(entity => {
          const creatorAddress = entity.id
          return (
            <Table.Row key={entity.id}>
              {!entity ? (
                <Loader active inline />
              ) : (
                <>
                  <Table.Cell width={5}>
                    <div className="rankings-creator-cell">
                      <Link to={locations.account(creatorAddress)}>
                        <Profile
                          address={creatorAddress}
                          inline={false}
                          size="large"
                        />
                      </Link>
                    </div>
                  </Table.Cell>
                  <Table.Cell width={3}>{entity.collections}</Table.Cell>
                  <Table.Cell width={2}>{entity.sales}</Table.Cell>
                  <Table.Cell width={3}>{entity.uniqueCollectors}</Table.Cell>
                  <Table.Cell>
                    <Mana network={Network.MATIC} inline>
                      {formatWeiMANA(entity.volume)}
                    </Mana>
                    <span className="rankings-fiat-price">
                      (<ManaToFiat mana={entity.volume} />)
                    </span>
                  </Table.Cell>
                </>
              )}
            </Table.Row>
          )
        })
      case RankingEntities.COLLECTORS:
        return (data as CollectorRank[])?.map(entity => {
          const collectorAddress = entity.id
          return (
            <Table.Row key={entity.id}>
              {!entity ? (
                <Loader active inline />
              ) : (
                <>
                  <Table.Cell width={5}>
                    <div className="rankings-creator-cell">
                      <Link to={locations.account(collectorAddress)}>
                        <Profile
                          address={collectorAddress}
                          inline={false}
                          size="huge"
                        />
                      </Link>
                    </div>
                  </Table.Cell>
                  <Table.Cell width={2}>{entity.purchases}</Table.Cell>
                  <Table.Cell width={3}>{entity.creatorsSupported}</Table.Cell>
                  <Table.Cell width={3}>{entity.uniqueItems}</Table.Cell>
                  <Table.Cell>
                    <Mana network={Network.MATIC} inline>
                      {formatWeiMANA(entity.volume)}
                    </Mana>
                    <span className="rankings-fiat-price">
                      (<ManaToFiat mana={entity.volume} />)
                    </span>
                  </Table.Cell>
                </>
              )}
            </Table.Row>
          )
        })
    }
  }

  return (
    <div className="RankingsTable">
      <HeaderMenu>
        <HeaderMenu.Left>
          <Header>{t('home_page.analytics.rankings.title')}</Header>
          <span className="subtitle">
            {t('home_page.analytics.rankings.subtitle')}
          </span>
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
          <TimeframeSelector
            value={currentTimeframe}
            onChange={timeframe => setCurrentTimeframe(timeframe)}
          />
        </HeaderMenu.Right>
      </HeaderMenu>
      <div className="rankings-card">
        {renderTableTabs()}
        <Loader active={isLoading} size="large" />

        {isLoading ? (
          <Loader active size="large" />
        ) : (
          <Table basic="very">
            <NotMobile>{getTableHeader()}</NotMobile>
            <Table.Body>{renderTableContent()}</Table.Body>
          </Table>
        )}
      </div>
    </div>
  )
}

export default React.memo(RankingsTable)
