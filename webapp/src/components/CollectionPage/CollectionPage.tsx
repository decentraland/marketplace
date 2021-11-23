import React, { useEffect, useMemo } from 'react'
import {
  Back,
  Column,
  Narrow,
  Page,
  Row,
  Section,
  Header,
  Badge,
  Icon,
  Color,
  Button,
  Loader,
  Table,
  Dropdown
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Props } from './CollectionPage.types'
import { AssetImage } from '../AssetImage'
import { Mana } from '../Mana'
import { formatMANA } from '../../lib/mana'
import styles from './CollectionPage.module.css'
import { Rarity } from '@dcl/schemas'
import { getBuilderCollectionDetailUrl } from './utils'

const CollectionPage = (props: Props) => {
  const { collection, items, isLoading, onFetchCollection, onBack } = props

  useEffect(() => {
    onFetchCollection()
  }, [onFetchCollection])

  const builderCollectionUrl = useMemo(
    () => getBuilderCollectionDetailUrl(collection?.contractAddress || ''),
    [collection]
  )

  return (
    <div>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_STORE} />
      <Page className={styles.page}>
        {isLoading ? (
          <Loader size="massive" active />
        ) : !collection ? (
          <div>No Collection</div>
        ) : (
          <>
            <Section>
              <Column>
                <Back absolute onClick={onBack} />
                <Narrow>
                  <Row stacked>
                    <Column>
                      <Row>
                        <Header size="large">{collection.name}</Header>
                        {collection.isOnSale && (
                          <Badge color={Color.SUMMER_RED}>
                            <Icon name="tag" />
                            <span className={styles.badge}>
                              {t('collection_page.on_sale')}
                            </span>
                          </Badge>
                        )}
                      </Row>
                    </Column>
                    <Column align="right">
                      <Row align="right">
                        <Button
                          primary
                          inverted
                          compact
                          as="a"
                          href={builderCollectionUrl}
                        >
                          {t('collection_page.edit_in_builder')}
                        </Button>
                        <Button
                          primary
                          inverted
                          compact
                          as="a"
                          href={builderCollectionUrl}
                        >
                          {collection.isOnSale
                            ? t('collection_page.unlist_from_market')
                            : t('collection_page.list_on_market')}
                        </Button>
                      </Row>
                    </Column>
                  </Row>
                </Narrow>
              </Column>
            </Section>
            <Section>
              <Narrow>
                <Table basic="very">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>{t('global.item')}</Table.HeaderCell>
                      <Table.HeaderCell>
                        {t('global.category')}
                      </Table.HeaderCell>
                      <Table.HeaderCell>{t('global.rarity')}</Table.HeaderCell>
                      <Table.HeaderCell>{t('global.stock')}</Table.HeaderCell>
                      <Table.HeaderCell>{t('global.price')}</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {items.map(item => (
                      <Table.Row key={item.id} className={styles.row}>
                        <Table.Cell>
                          <div className={styles.firstCell}>
                            <div className={styles.imageContainer}>
                              <AssetImage asset={item} isSmall />
                            </div>
                            <div className={styles.title}>{item.name}</div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>{t(`global.${item.category}`)}</Table.Cell>
                        <Table.Cell>
                          {t(`wearable.rarity.${item.rarity}`)}
                        </Table.Cell>
                        <Table.Cell>
                          {item.available.toLocaleString()}/
                          {Rarity.getMaxSupply(item.rarity).toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                          <Mana network={item.network} inline>
                            {formatMANA(item.price)}
                          </Mana>
                        </Table.Cell>
                        <Table.Cell>
                          <Dropdown
                            className={styles.ellipsis}
                            icon="ellipsis horizontal"
                            direction="left"
                          >
                            <Dropdown.Menu>
                              <Dropdown.Item
                                text={t('collection_page.edit_price')}
                                as="a"
                                href={builderCollectionUrl}
                              />
                              <Dropdown.Item
                                text={t('collection_page.mint_item')}
                                as="a"
                                href={builderCollectionUrl}
                              />
                            </Dropdown.Menu>
                          </Dropdown>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Narrow>
            </Section>
          </>
        )}
      </Page>
      <Footer />
    </div>
  )
}

export default React.memo(CollectionPage)
