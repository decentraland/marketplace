import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import {
  HeaderMenu,
  Header,
  NotMobile,
  Table,
  Loader,
  Mana,
  Tabs,
  Dropdown,
  DropdownProps,
  Mobile
} from 'decentraland-ui'
import { Item, NFTCategory, Sale, SaleSortBy } from '@dcl/schemas'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { useScrollSectionIntoView } from '../../modules/ui/utils'
import { AssetProvider } from '../AssetProvider'
import { AssetType } from '../../modules/asset/types'
import { formatWeiMANA } from '../../lib/mana'
import { ManaToFiat } from '../ManaToFiat'
import { VendorName } from '../../modules/vendor/types'
import { NFT } from '../../modules/nft/types'
import { LinkedProfile } from '../LinkedProfile'
import { AssetImage } from '../AssetImage'
import { formatDistanceToNow } from '../../lib/date'
import { Props } from './RecentlySoldTable.types'
import './RecentlySoldTable.css'

const TABLE_SIZE = 7
const TABS_PREFIX = '#recently-sold-'

const RecentlySoldTable = (props: Props) => {
  const { isLoading, onFetchRecentSales, data } = props
  const history = useHistory()
  const location = useLocation()
  const recentlySoldCardRef = useRef<HTMLDivElement>(null)
  const [currentCategory, setCurrentyCategory] = useState(NFTCategory.WEARABLE)

  useScrollSectionIntoView(
    recentlySoldCardRef,
    TABS_PREFIX,
    setCurrentyCategory
  )

  useEffect(() => {
    onFetchRecentSales({
      categories:
        currentCategory === NFTCategory.PARCEL
          ? [NFTCategory.ESTATE, NFTCategory.PARCEL]
          : [currentCategory],
      first: TABLE_SIZE,
      sortBy: SaleSortBy.RECENTLY_SOLD
    })
  }, [currentCategory, onFetchRecentSales])

  const timestamp = useMemo(() => new Date().toLocaleString(), [])

  const handleTabChange = (category: NFTCategory) => {
    setCurrentyCategory(category)
    history.replace({
      pathname: location.pathname,
      hash: `${TABS_PREFIX}${category}`
    })
  }

  const handleOnLinkClick = (id: string) => {
    getAnalytics().track('Asset click', {
      id,
      section: 'Recently Sold'
    })
  }

  const renderTableTabs = () => {
    return (
      <div className="recently-sold-card-tabs" ref={recentlySoldCardRef}>
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
                onClick={() => handleTabChange(category as NFTCategory)}
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

  const renderCategoryDropdown = () => {
    return (
      <Dropdown
        className="recently-sold-dropdown"
        defaultValue={NFTCategory.WEARABLE}
        value={currentCategory}
        direction="right"
        options={[
          NFTCategory.WEARABLE,
          NFTCategory.PARCEL,
          NFTCategory.EMOTE,
          NFTCategory.ENS
        ].map(category => ({
          value: category as string,
          text: t(`home_page.recently_sold.tabs.${category}`)
        }))}
        onChange={(
          _event: React.SyntheticEvent<HTMLElement, Event>,
          { value }: DropdownProps
        ) => handleTabChange(value as NFTCategory)}
      />
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
                  `home_page.recently_sold.tabs.${
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

  const renderMobileTableHeader = () => {
    let header = <span>{t('global.item')}</span>
    if (currentCategory === NFTCategory.EMOTE) {
      header = <span>{t(`global.emote`)}</span>
    } else if (
      currentCategory === NFTCategory.PARCEL ||
      currentCategory === NFTCategory.ENS
    ) {
      header = (
        <span>
          {t(
            `global.${
              currentCategory === NFTCategory.PARCEL ? 'parcel' : 'ens'
            }`
          )}
        </span>
      )
    }
    return (
      <div className="table-header">
        <span>{header}</span>
        <span>{t('home_page.analytics.rankings.total_volume')}</span>
      </div>
    )
  }

  const soldItemRow = (sale: Sale, item: Item | null, isLoading: boolean) => {
    return (
      <>
        <Mobile>
          <div className="recently-sold-item-cell">
            {isLoading || !item ? (
              <Loader active size="large" />
            ) : (
              <>
                <div>
                  <div className="sale-item-data">
                    <Link
                      to={item.url}
                      onClick={() => handleOnLinkClick(item.id)}
                    >
                      <AssetImage asset={item} isSmall />
                    </Link>
                    <div className="sale-item-name-container">
                      <Link
                        to={item.url}
                        onClick={() => handleOnLinkClick(item.id)}
                      >
                        {item.name}
                      </Link>
                      <span className="recently-sold-sale-info">
                        {t(`global.${sale.type}`)}
                        <span className="separator">|</span>
                        {t('global.time_ago', {
                          time: formatDistanceToNow(sale.timestamp)
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="sale-item-right-data">
                    {item ? (
                      <>
                        <Mana network={item?.network} inline>
                          {formatWeiMANA(sale.price)}
                        </Mana>
                        <span className="rankings-fiat-price">
                          {sale.price ? (
                            <>
                              (<ManaToFiat mana={sale.price} />)
                            </>
                          ) : null}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div className="sale-item-more-data-container">
                    {item ? (
                      <>
                        <div>
                          <span>
                            {t('home_page.recently_sold.wearables.seller')}
                          </span>
                          <LinkedProfile
                            className="account-link"
                            address={sale.seller}
                            textOnly
                            inline={false}
                          />
                        </div>
                        <div>
                          <span>
                            {t('home_page.recently_sold.wearables.buyer')}
                          </span>
                          <LinkedProfile
                            className="account-link"
                            address={sale.buyer}
                            textOnly
                            inline={false}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        </Mobile>
        <NotMobile>
          <Table.Row key={sale.id}>
            <Table.Cell width={4}>
              {item ? (
                <div className="recently-sold-item-cell">
                  <Link
                    className="recently-sold-item-cell-thumbnail"
                    to={item.url}
                    onClick={() => handleOnLinkClick(item.id)}
                  >
                    <AssetImage asset={item} isSmall />
                  </Link>

                  <div className="sale-item-data">
                    <Link
                      to={item.url}
                      onClick={() => handleOnLinkClick(item.id)}
                    >
                      {item.name}
                    </Link>

                    <span>
                      <T
                        id="home_page.analytics.rankings.by_creator"
                        values={{
                          creator: (
                            <span className="rankings-item-data-creator">
                              <LinkedProfile
                                address={item.creator}
                                textOnly
                                inline={false}
                              />
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
              <LinkedProfile
                className="account-link"
                address={sale.seller}
                textOnly
                inline={false}
              />
            </Table.Cell>
            <Table.Cell width={2}>
              <LinkedProfile
                className="account-link"
                address={sale.buyer}
                textOnly
                inline={false}
              />
            </Table.Cell>
            <Table.Cell width={1}>{t(`global.${sale.type}`)}</Table.Cell>
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
        </NotMobile>
      </>
    )
  }

  const soldParcelOrENSRow = (
    sale: Sale,
    asset: NFT<VendorName.DECENTRALAND> | null,
    isLoading: boolean
  ) => {
    return (
      <>
        <Mobile>
          <div className="recently-sold-item-cell">
            {isLoading || !asset ? (
              <Loader active size="large" />
            ) : (
              <>
                <div>
                  <div className="sale-item-data">
                    <Link
                      to={asset.url}
                      onClick={() => handleOnLinkClick(asset.id)}
                    >
                      <AssetImage asset={asset} showMonospace isSmall />
                    </Link>
                    <div className="sale-item-name-container">
                      <Link
                        to={asset.url}
                        onClick={() => handleOnLinkClick(asset.id)}
                      >
                        {asset.name}
                      </Link>
                      <span className="recently-sold-sale-info">
                        {t(`global.${sale.type}`)}
                        <span className="separator">|</span>
                        {t('global.time_ago', {
                          time: formatDistanceToNow(sale.timestamp)
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="sale-item-right-data">
                    {asset ? (
                      <>
                        <Mana network={asset?.network} inline>
                          {formatWeiMANA(sale.price)}
                        </Mana>
                        <span className="rankings-fiat-price">
                          {sale.price ? (
                            <>
                              (<ManaToFiat mana={sale.price} />)
                            </>
                          ) : null}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div className="sale-item-more-data-container">
                    {asset ? (
                      <>
                        <div>
                          <span>
                            {t('home_page.recently_sold.wearables.seller')}
                          </span>
                          <LinkedProfile
                            className="account-link"
                            address={sale.seller}
                            textOnly
                            inline={false}
                          />
                        </div>
                        <div>
                          <span>
                            {t('home_page.recently_sold.wearables.buyer')}
                          </span>
                          <LinkedProfile
                            className="account-link"
                            address={sale.buyer}
                            textOnly
                            inline={false}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        </Mobile>
        <NotMobile>
          <Table.Row key={sale.id}>
            <Table.Cell width={4}>
              {asset ? (
                <div className="recently-sold-item-cell">
                  <Link
                    className="recently-sold-item-cell-thumbnail"
                    to={asset.url}
                    onClick={() => handleOnLinkClick(asset.id)}
                  >
                    <AssetImage asset={asset} showMonospace isSmall />
                  </Link>
                  <div className="rankings-item-data">
                    <Link
                      to={asset.url}
                      onClick={() => handleOnLinkClick(asset.id)}
                    >
                      {asset.name}
                    </Link>
                  </div>
                </div>
              ) : isLoading ? (
                <Loader active inline />
              ) : null}
            </Table.Cell>
            <Table.Cell width={2}>
              <LinkedProfile
                className="account-link"
                address={sale.seller}
                textOnly
                inline={false}
              />
            </Table.Cell>
            <Table.Cell width={2}>
              <LinkedProfile
                className="account-link"
                address={sale.buyer}
                textOnly
                inline={false}
              />
            </Table.Cell>
            <Table.Cell width={1}>{t(`global.${sale.type}`)}</Table.Cell>
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
        </NotMobile>
      </>
    )
  }

  const renderTableContent = useCallback(() => {
    if (!data) {
      return null
    }
    let content
    switch (currentCategory) {
      case NFTCategory.WEARABLE:
      case NFTCategory.EMOTE:
        content = data.map(sale => (
          <AssetProvider
            key={sale.id}
            type={AssetType.ITEM}
            contractAddress={sale.contractAddress}
            tokenId={sale.itemId}
          >
            {(item, _order, _rental, isLoading) =>
              soldItemRow(sale, item, isLoading)
            }
          </AssetProvider>
        ))
        break
      case NFTCategory.ENS:
      case NFTCategory.PARCEL:
        content = data.map(sale => (
          <AssetProvider
            key={sale.id}
            type={AssetType.NFT}
            contractAddress={sale.contractAddress}
            tokenId={sale.tokenId}
          >
            {(asset, _order, _rental, isLoading) =>
              soldParcelOrENSRow(sale, asset, isLoading)
            }
          </AssetProvider>
        ))
        break
    }
    return (
      <>
        <Mobile>{content}</Mobile>
        <NotMobile>
          <Table basic="very">
            {getTableHeader()}
            <Table.Body>{content}</Table.Body>
          </Table>
        </NotMobile>
      </>
    )
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
        <Mobile>{renderCategoryDropdown()}</Mobile>
        <NotMobile>{renderTableTabs()}</NotMobile>

        {isLoading ? (
          <Loader active size="large" />
        ) : (
          <>
            <Mobile>{renderMobileTableHeader()}</Mobile>
            {renderTableContent()}
          </>
        )}
      </div>
    </div>
  )
}

export default React.memo(RecentlySoldTable)
