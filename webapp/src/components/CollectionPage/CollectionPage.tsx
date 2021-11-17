import React, { useEffect } from 'react'
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
  Table
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

const CollectionPage = (props: Props) => {
  const { collection, items, isLoading, onFetchCollections, onBack } = props

  useEffect(() => {
    onFetchCollections()
  }, [onFetchCollections])

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
                        <Badge color={Color.SUMMER_RED}>
                          <Icon name="tag" />
                          <span className={styles.badge}>
                            {t('collection_page.on_sale')}
                          </span>
                        </Badge>
                      </Row>
                    </Column>
                    <Column align="right">
                      <Row align="right">
                        <Button primary inverted compact>
                          {t('collection_page.edit_in_builder')}
                        </Button>
                        <Button primary inverted compact>
                          {t('collection_page.unlist_from_market')}
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
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {items.map(item => (
                      <Table.Row>
                        <Table.Cell>
                          <div className={styles['first-cell']}>
                            <div className={styles['image-container']}>
                              <AssetImage asset={item} isSmall />
                            </div>
                            <div className={styles.title}>{item.name}</div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>{t(`global.${item.category}`)}</Table.Cell>
                        <Table.Cell>{t(`global.${item.rarity}`)}</Table.Cell>
                        <Table.Cell>
                          {item.available}/{1000}
                        </Table.Cell>
                        <Table.Cell>
                          <Mana network={item.network} inline>
                            {formatMANA(item.price)}
                          </Mana>
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
