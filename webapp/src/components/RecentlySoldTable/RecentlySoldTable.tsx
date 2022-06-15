import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HeaderMenu,
  Header,
  NotMobile,
  Table,
  Loader,
  Mana,
  Tabs
} from 'decentraland-ui'
import { NFTCategory, SaleSortBy } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'
import { AssetProvider } from '../AssetProvider'
import { AssetType } from '../../modules/asset/types'
import { formatWeiMANA } from '../../lib/mana'
import { locations } from '../../modules/routing/locations'
import { ManaToFiat } from '../ManaToFiat'
import { AssetImage } from '../AssetImage'
import { formatDistanceToNow } from '../../lib/date'
import { Props } from './RecentlySoldTable.types'
import './RecentlySoldTable.css'

const TABLE_SIZE = 7

const RecentlySoldTable = (props: Props) => {
  const { isLoading, onFetchRecentSales, data } = props
  const [currentCategory, setCurrentyCategory] = useState(NFTCategory.WEARABLE)

  useEffect(() => {
    onFetchRecentSales({
      category: currentCategory,
      first: TABLE_SIZE,
      sortBy: SaleSortBy.RECENTLY_SOLD
    })
  }, [currentCategory, onFetchRecentSales])

  const timestamp = useMemo(() => new Date().toLocaleString(), [])

  const renderTableTabs = () => {
    return (
      <div className="recently-sold-card-tabs">
        <Tabs isFullscreen>
          <Tabs.Left>
            {Object.values([
              NFTCategory.WEARABLE,
              NFTCategory.PARCEL,
              NFTCategory.EMOTE,
              NFTCategory.ENS
            ]).map(category => (
              <Tabs.Tab
                key={category as string}
                active={currentCategory === category}
                onClick={() => setCurrentyCategory(category as NFTCategory)}
              >
                {t(`home_page.recently_sold.tabs.${category}`)}
              </Tabs.Tab>
            ))}
          </Tabs.Left>
        </Tabs>
        <span className="recently-sold-timestamp">
          {t('home_page.recently_sold.last_updated', {
            date: timestamp
          })}
        </span>
      </div>
    )
  }

  const getTableHeader = () => {
    switch (currentCategory) {
      case NFTCategory.WEARABLE:
      case NFTCategory.EMOTE:
        return (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t(
                  `global.${
                    currentCategory === NFTCategory.WEARABLE ? 'item' : 'emote'
                  }`
                )}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.seller')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.buyer')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.type')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.time')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.price')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )
      case NFTCategory.PARCEL:
      case NFTCategory.ENS:
        return (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t(
                  `global.${
                    currentCategory === NFTCategory.PARCEL ? 'parcel' : 'ens'
                  }`
                )}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.seller')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.buyer')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.type')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.time')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('home_page.recently_sold.wearables.price')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )
      default:
        break
    }
  }

  const renderTableContent = useCallback(() => {
    if (!data) {
      return null
    }
    switch (currentCategory) {
      case NFTCategory.WEARABLE:
      case NFTCategory.EMOTE:
        return data.map(sale => {
          return (
            <AssetProvider
              key={sale.id}
              type={AssetType.ITEM}
              contractAddress={sale.contractAddress}
              tokenId={sale.itemId}
            >
              {(item, _order, isLoading) => {
                if (!isLoading && !item) {
                  return null
                }
                return (
                  <Table.Row key={sale.id}>
                    <Table.Cell width={4}>
                      {item ? (
                        <div className="recently-sold-item-cell">
                          <Link
                            className="recently-sold-item-cell-thumbnail"
                            to={item.url}
                          >
                            <img
                              src={item.thumbnail}
                              alt={`${item.name}-thumbnail`}
                            />
                          </Link>

                          <div className="rankings-item-data">
                            <Link to={item.url}>{item.name}</Link>

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
                      <Link
                        to={locations.account(sale.seller)}
                        className="account-link"
                      >
                        <Profile
                          address={sale.seller}
                          textOnly
                          inline={false}
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell width={2}>
                      <Link
                        to={locations.account(sale.buyer)}
                        className="account-link"
                      >
                        <Profile address={sale.buyer} textOnly inline={false} />
                      </Link>
                    </Table.Cell>
                    <Table.Cell width={1}>
                      {t(`global.${sale.type}`)}
                    </Table.Cell>
                    <Table.Cell width={2}>
                      {t('global.time_ago', {
                        time: formatDistanceToNow(sale.timestamp)
                      })}
                    </Table.Cell>
                    <Table.Cell width={2}>
                      <Mana network={item?.network} inline>
                        {formatWeiMANA(sale.price)}
                      </Mana>
                      <span className="rankings-fiat-price">
                        (<ManaToFiat mana={sale.price} />)
                      </span>
                    </Table.Cell>
                  </Table.Row>
                )
              }}
            </AssetProvider>
          )
        })
      case NFTCategory.ENS:
      case NFTCategory.PARCEL:
        return data.map(sale => {
          return (
            <AssetProvider
              key={sale.id}
              type={AssetType.NFT}
              contractAddress={sale.contractAddress}
              tokenId={sale.tokenId}
            >
              {(asset, _order, isLoading) => {
                if (!isLoading && !asset) {
                  return null
                }
                return (
                  <Table.Row key={sale.id}>
                    <Table.Cell width={4}>
                      {asset ? (
                        <div className="recently-sold-item-cell">
                          <Link
                            className="recently-sold-item-cell-thumbnail"
                            to={asset.url}
                          >
                            <AssetImage asset={asset} showMonospace isSmall />
                          </Link>
                          <div className="rankings-item-data">
                            <Link to={asset.url}>{asset.name}</Link>
                          </div>
                        </div>
                      ) : isLoading ? (
                        <Loader active inline />
                      ) : null}
                    </Table.Cell>
                    <Table.Cell width={2}>
                      <Link
                        to={locations.account(sale.seller)}
                        className="account-link"
                      >
                        <Profile
                          address={sale.seller}
                          textOnly
                          inline={false}
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell width={2}>
                      <Link
                        to={locations.account(sale.buyer)}
                        className="account-link"
                      >
                        <Profile address={sale.buyer} textOnly inline={false} />
                      </Link>
                    </Table.Cell>
                    <Table.Cell width={1}>
                      {t(`global.${sale.type}`)}
                    </Table.Cell>
                    <Table.Cell width={2}>
                      {t('global.time_ago', {
                        time: formatDistanceToNow(sale.timestamp)
                      })}
                    </Table.Cell>
                    <Table.Cell width={2}>
                      <Mana network={asset?.network} inline>
                        {formatWeiMANA(sale.price)}
                      </Mana>
                      <span className="rankings-fiat-price">
                        (<ManaToFiat mana={sale.price} />)
                      </span>
                    </Table.Cell>
                  </Table.Row>
                )
              }}
            </AssetProvider>
          )
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className="RecentlySoldTable">
      <HeaderMenu>
        <HeaderMenu.Left>
          <Header>{t('home_page.recently_sold.title')}</Header>
        </HeaderMenu.Left>
      </HeaderMenu>
      <div className="recently-sold-card">
        {renderTableTabs()}

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

export default React.memo(RecentlySoldTable)
