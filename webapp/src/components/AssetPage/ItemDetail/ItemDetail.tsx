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

const ownersMock: { issuedId: number; ownerId: string }[] = [
  {
    issuedId: 1,
    ownerId: '0x353eabbab90269cb88d273edebaa8cf18a02abc4'
  },
  {
    issuedId: 2,
    ownerId: '0x75ceb89323b2c3e4fa872b2495ce1b783df6a847'
  },
  {
    issuedId: 3,
    ownerId: '0x8d277df8465f423ab1b7311c3693b80fe3e5b440'
  },
  {
    issuedId: 4,
    ownerId: '0x03d05b7efd62be3f6e66972d96deb96cb2ac6d1d'
  },
  {
    issuedId: 5,
    ownerId: '0x0d28e6707a2492ad6c9bca977103d575953bf80d'
  },
  {
    issuedId: 6,
    ownerId: '0x72544fc541922e59b85b36c3d10c3a8370a8b7a2'
  },
  {
    issuedId: 7,
    ownerId: '0x4eb13941f46ae60a862ce254ab8e9a0d080af0d8'
  },
  {
    issuedId: 8,
    ownerId: '0xf316ce7e8aa6f0f3cecdebdb862d94a358026adc'
  },
  {
    issuedId: 9,
    ownerId: '0x09d44876be494c2317ffe4c852d866b6e28d4928'
  },
  {
    issuedId: 10,
    ownerId: '0xa62608ddabbb98bc4249bf20401a77a0576d9b1a'
  }
]

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
                <div className={styles.tabStyle}>{t('transaction_history.title')}</div>
              </Tabs.Tab>
              <Tabs.Tab
                active={belowTab === BelowTabs.OWNERS}
                onClick={() => setBelowTab(BelowTabs.OWNERS)}
              >
                {t('owners_table.owners')}
              </Tabs.Tab>
            </Tabs>
            {belowTab === BelowTabs.OWNERS && <Dropdown
              text= {t('owners_table.issue_number')}
              direction="right"
              className={styles.sortByDropdown}
            >
              <Dropdown.Menu>
                <Dropdown.Item text= {t('owners_table.issue_number')} />
              </Dropdown.Menu>
            </Dropdown>}
          </div>

          {belowTab === BelowTabs.LISTINGS ? (
            <TransactionHistory asset={item} />
          ) : (
            <OwnersTable owners={ownersMock} />
          )}
        </div>
      }
    />
  )
}

export default React.memo(ItemDetail)
