import React, { useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { BodyShape, EmotePlayMode, NFTCategory } from '@dcl/schemas'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/vendor/decentraland'
import RarityBadge from '../../RarityBadge'
import { AssetType } from '../../../modules/asset/types'
import GenderBadge from '../../GenderBadge'
import { AssetImage } from '../../AssetImage'
import CampaignBadge from '../../Campaign/CampaignBadge'
import CategoryBadge from '../CategoryBadge'
import SmartBadge from '../SmartBadge'
import { Description } from '../Description'
import { Owner } from '../Owner'
import Collection from '../Collection'
import BaseDetail from '../BaseDetail'
import IconBadge from '../IconBadge'
import { TransactionHistory } from '../TransactionHistory'
import { SaleActionBox } from '../SaleActionBox'
import { Props } from './ItemDetail.types'
import { OwnersTable } from '../OwnersTable'
import { Dropdown, Tabs } from 'decentraland-ui'
import styles from './ItemDetail.module.css'
import { OrderDirection } from '../OwnersTable/OwnersTable.types'

enum BelowTabs {
  LISTINGS = 'listings',
  OWNERS = 'owners'
}

const ItemDetail = ({ item }: Props) => {
  let description = ''
  let bodyShapes: BodyShape[] = []
  let category
  let loop = false

  const [belowTab, setBelowTab] = useState(BelowTabs.LISTINGS)
  const [orderDirection, setOrderDirection] = useState(OrderDirection.ASC)

  const orderDirectionOptions = [
    {
      text: t('owners_table.issue_number_asc'),
      value: OrderDirection.ASC
    },
    {
      text: t('owners_table.issue_number_desc'),
      value: OrderDirection.DESC
    }
  ]

  switch (item.category) {
    case NFTCategory.WEARABLE:
      description = item.data.wearable!.description
      bodyShapes = item.data.wearable!.bodyShapes
      category = item.data.wearable!.category
      break
    case NFTCategory.EMOTE:
      description = item.data.emote!.description
      bodyShapes = item.data.emote!.bodyShapes
      category = item.data.emote!.category
      loop = item.data.emote!.loop
      break
  }

  const emoteBadgeHref = useMemo(
    () =>
      locations.browse({
        assetType: AssetType.ITEM,
        section: Section.EMOTES,
        emotePlayMode: loop ? [EmotePlayMode.LOOP] : [EmotePlayMode.SIMPLE]
      }),
    [loop]
  )

  return (
    <BaseDetail
      asset={item}
      assetImage={<AssetImage asset={item} isDraggable />}
      isOnSale={item.isOnSale}
      badges={
        <>
          <RarityBadge
            rarity={item.rarity}
            assetType={AssetType.ITEM}
            category={NFTCategory.WEARABLE}
          />
          {category && (
            <CategoryBadge
              category={
                item.data.emote
                  ? item.data.emote.category
                  : item.data.wearable!.category
              }
              assetType={AssetType.ITEM}
            />
          )}
          {item.category === NFTCategory.EMOTE && (
            <IconBadge
              icon={loop ? 'play-loop' : 'play-once'}
              text={t(`emote.play_mode.${loop ? 'loop' : 'simple'}`)}
              href={emoteBadgeHref}
            />
          )}
          {bodyShapes.length > 0 && !item.data.emote && (
            <GenderBadge
              bodyShapes={bodyShapes}
              assetType={AssetType.ITEM}
              section={
                item.category === NFTCategory.WEARABLE
                  ? Section.WEARABLES
                  : Section.EMOTES
              }
            />
          )}
          {item.category === NFTCategory.WEARABLE &&
            item.data.wearable!.isSmart && (
              <SmartBadge assetType={AssetType.ITEM} />
            )}

          <CampaignBadge contract={item.contractAddress} />
        </>
      }
      left={
        <>
          <Description text={description} />
          <div className="BaseDetail row">
            <Owner asset={item} />
            <Collection asset={item} />
          </div>
        </>
      }
      box={null}
      showDetails
      actions={<SaleActionBox asset={item} />}
      below={
        <div className={styles.tableContainer}>
          <div className={styles.filtertabsContainer}>
            <Tabs isFullscreen>
              <Tabs.Tab
                active={belowTab === BelowTabs.LISTINGS}
                onClick={() => setBelowTab(BelowTabs.LISTINGS)}
              >
                <div className={styles.tabStyle}>
                  {t('transaction_history.title')}
                </div>
              </Tabs.Tab>
              <Tabs.Tab
                active={belowTab === BelowTabs.OWNERS}
                onClick={() => setBelowTab(BelowTabs.OWNERS)}
              >
                {t('owners_table.owners')}
              </Tabs.Tab>
            </Tabs>
            {belowTab === BelowTabs.OWNERS && (
              <Dropdown
                direction="left"
                className={styles.sortByDropdown}
                value={orderDirection}
                onChange={(_event, data) => {
                  const value = data.value as OrderDirection
                  setOrderDirection(value)
                }}
                options={orderDirectionOptions}
              />
            )}
          </div>

          {belowTab === BelowTabs.LISTINGS ? (
            <TransactionHistory asset={item} />
          ) : (
            <OwnersTable asset={item} orderDirection={orderDirection} />
          )}
        </div>
      }
    />
  )
}

export default React.memo(ItemDetail)
