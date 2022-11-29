import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader, Mana, Mobile, NotMobile, Table } from 'decentraland-ui'
import { Item, NFTCategory } from '@dcl/schemas'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { formatWeiMANA } from '../../../lib/mana'
import { AssetType } from '../../../modules/asset/types'
import { parseItemId } from '../../../modules/item/utils'
import { ItemRank } from '../../../modules/analytics/types'
import { locations } from '../../../modules/routing/locations'
import { AssetProvider } from '../../AssetProvider'
import { ManaToFiat } from '../../ManaToFiat'
import RarityBadge from '../../RarityBadge'
import { AssetImage } from '../../AssetImage'
import { LinkedProfile } from '../../LinkedProfile'
import { Props } from './RankingItemRow.types'
import './RankingItemRow.css'

const RankingItemRow = ({ entity }: Props) => {
  const [expanded, setExpanded] = useState(false)

  const handleOnLinkClick = (id: string) => {
    getAnalytics().track('Asset click', {
      id,
      section: 'Rankings'
    })
  }

  const renderMobile = (
    entity: ItemRank,
    item: Item | null,
    isLoading: boolean
  ) => {
    return (
      <div className="RankingItemRow rankings-item-cell">
        {isLoading || !item ? (
          <Loader active size="large" />
        ) : (
          <>
            <div>
              <div className="rankings-item-data">
                <Link
                  to={locations.item(item.contractAddress, item.itemId)}
                  onClick={() => handleOnLinkClick(item.id)}
                >
                  <AssetImage asset={item} isSmall />
                </Link>
                <div className="rankings-item-name-container">
                  <Link
                    to={locations.item(item.contractAddress, item.itemId)}
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
                  {item ? (
                    <div className="rankings-item-badge-container">
                      <RarityBadge
                        size="small"
                        rarity={item.rarity}
                        assetType={AssetType.NFT}
                        category={NFTCategory.WEARABLE}
                        withTooltip={false}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="rankings-item-right-data">
                {item ? (
                  <>
                    <Mana network={item?.network} inline>
                      {formatWeiMANA(entity.volume)}
                    </Mana>
                    <span className="rankings-fiat-price">
                      (<ManaToFiat mana={entity.volume} />)
                    </span>
                    <div
                      className="arrow-container"
                      onClick={() => setExpanded(!expanded)}
                    >
                      <span> {t(`global.${expanded ? 'less' : 'more'}`)} </span>
                      <i className={`caret back ${expanded ? 'up' : ''}`} />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            {expanded ? (
              <div>
                <div className="rankings-item-more-data-container">
                  {item ? (
                    <>
                      <div>
                        <span>{t('global.category')}</span>
                        {item.data.wearable?.category
                          ? t(
                              `wearable.category.${item.data.wearable.category}`
                            )
                          : t(`emote.category.${item.data.emote!.category}`)}
                      </div>
                      <div>
                        <span>
                          {t(
                            `home_page.analytics.rankings.${
                              item.data.wearable ? 'wearables' : 'emotes'
                            }.items_sold`
                          )}
                        </span>
                        {entity.sales}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    )
  }

  const renderNotMobile = (
    entity: ItemRank,
    item: Item | null,
    isLoading: boolean
  ) => (
    <Table.Row>
      <Table.Cell width={7}>
        {item ? (
          <div className="rankings-item-cell">
            <Link
              to={locations.item(item.contractAddress, item.itemId)}
              onClick={() => handleOnLinkClick(item.id)}
            >
              <AssetImage asset={item} isSmall />
            </Link>

            <div className="rankings-item-data">
              <Link
                to={locations.item(item.contractAddress, item.itemId)}
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
        {item
          ? item.data.wearable?.category
            ? t(`wearable.category.${item.data.wearable.category}`)
            : t(`emote.category.${item.data.emote!.category}`)
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
      <Table.Cell width={2}>{item ? entity.sales : null}</Table.Cell>
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
    </Table.Row>
  )

  return (
    <AssetProvider
      key={entity.id}
      type={AssetType.ITEM}
      contractAddress={parseItemId(entity.id).contractAddress}
      tokenId={parseItemId(entity.id).tokenId}
    >
      {(item, _order, _rental, isLoading) => {
        if (!isLoading && !item) {
          return null
        }
        return (
          <>
            <Mobile>{renderMobile(entity, item, isLoading)}</Mobile>
            <NotMobile>{renderNotMobile(entity, item, isLoading)}</NotMobile>
          </>
        )
      }}
    </AssetProvider>
  )
}

export default React.memo(RankingItemRow)
