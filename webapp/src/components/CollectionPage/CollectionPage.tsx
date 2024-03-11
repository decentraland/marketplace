import React, { useCallback, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { Back, Column, Page, Row, Section, Header, Badge, Icon, Color, Button, Loader, useMobileMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getBuilderCollectionDetailUrl } from '../../modules/collection/utils'
import { formatWeiMANA } from '../../lib/mana'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import CollectionProvider from '../CollectionProvider'
import { Navigation } from '../Navigation'
import AssetCell from '../OnSaleOrRentList/AssetCell'
import { Mana } from '../Mana'
import TableContainer from '../Table/TableContainer'
import { TableContent } from '../Table/TableContent'
import { formatDataToTable } from './utils'
import { Props } from './CollectionPage.types'
import styles from './CollectionPage.module.css'

const WEARABLES_TAB = 'wearables'
const EMOTES_TAB = 'emotes'

const CollectionPage = (props: Props) => {
  const { contractAddress, currentAddress, onBack } = props

  const isMobile = useMobileMediaQuery()

  const tabList = [
    {
      value: WEARABLES_TAB,
      displayValue: t('home_page.recently_sold.tabs.wearable')
    },
    {
      value: EMOTES_TAB,
      displayValue: t('home_page.recently_sold.tabs.emote')
    }
  ]

  const [tab, setTab] = useState<string>(WEARABLES_TAB)

  const handleTabChange = useCallback(
    (tab: string) => {
      setTab(tab)
    },
    [setTab]
  )

  return (
    <div>
      <Navbar />
      <Navigation />
      <Page className={styles.page}>
        {contractAddress ? (
          <CollectionProvider contractAddress={contractAddress} withItems>
            {({ collection, items, isLoading }) => {
              const isCollectionOwner = !!collection && !!currentAddress && collection.creator.toLowerCase() === currentAddress

              const builderCollectionUrl = getBuilderCollectionDetailUrl(contractAddress)
              const hasWearables = items?.some(item => item.category === NFTCategory.WEARABLE)
              const hasEmotes = items?.some(item => item.category === NFTCategory.EMOTE)

              const filteredItems = items?.filter(item => {
                return hasWearables && hasEmotes
                  ? tab === WEARABLES_TAB
                    ? item.category === NFTCategory.WEARABLE
                    : item.category === NFTCategory.EMOTE
                  : items
              })

              const tableItems = formatDataToTable(filteredItems, isCollectionOwner, isMobile)

              const showShowTabs = hasEmotes && hasWearables

              return isLoading ? (
                <Loader size="massive" active />
              ) : !collection || !filteredItems ? (
                <div>{t('collection_page.no_collection')}</div>
              ) : (
                <>
                  <Section>
                    <Column>
                      <div className={styles.headerContainer}>
                        <Row stacked>
                          <Column>
                            <Row>
                              <div className={styles.backBtnContainer}>
                                <Back onClick={onBack} />
                              </div>
                              <Header size="large">{collection.name}</Header>
                              {collection.isOnSale && (
                                <Badge color={Color.SUMMER_RED}>
                                  <Icon name="tag" />
                                  <span className={styles.badge}>{t('collection_page.on_sale')}</span>
                                </Badge>
                              )}
                            </Row>
                          </Column>
                          {isCollectionOwner && (
                            <Column align="right" className={styles.columnRight}>
                              <Row align="right">
                                <Button primary inverted compact as="a" href={builderCollectionUrl}>
                                  {t('collection_page.edit_in_builder')}
                                </Button>
                                <Button primary inverted compact as="a" href={builderCollectionUrl}>
                                  {collection.isOnSale ? t('collection_page.unlist_from_market') : t('collection_page.list_on_market')}
                                </Button>
                              </Row>
                            </Column>
                          )}
                        </Row>
                      </div>
                    </Column>
                  </Section>
                  <Section>
                    <TableContainer
                      tabsList={showShowTabs ? tabList : []}
                      activeTab={tab}
                      handleTabChange={(tab: string) => handleTabChange(tab)}
                      children={
                        <TableContent
                          data={tableItems}
                          isLoading={isLoading}
                          empty={() => <div>{t('collection_page.no_collection')}</div>}
                          mobileTableBody={filteredItems.map(item => (
                            <div key={item.id} className="mobile-row">
                              <AssetCell asset={item} />
                              <Mana network={item.network} inline>
                                {formatWeiMANA(item.price)}
                              </Mana>
                            </div>
                          ))}
                          total={0}
                          hasHeaders={showShowTabs}
                        />
                      }
                    />
                  </Section>
                </>
              )
            }}
          </CollectionProvider>
        ) : (
          <div>{t('collection_page.no_collection')}</div>
        )}
      </Page>
      <Footer />
    </div>
  )
}

export default React.memo(CollectionPage)
