import React from 'react'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { NavigationTab } from '../Navigation/Navigation.types'
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
  Button
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import styles from './CollectionPage.module.css'
import { Props } from './CollectionPage.types'

const CollectionPage = ({
  collection,
  // items,
  onBack
}: Props) => {
  return (
    <div>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_STORE} />
      <Page className={styles.page}>
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
      </Page>
      <Footer />
    </div>
  )
}

export default React.memo(CollectionPage)
