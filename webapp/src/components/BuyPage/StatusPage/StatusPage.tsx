import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Header, Loader, Page } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { PurchaseStatus } from 'decentraland-dapps/dist/modules/gateway/types'
import { locations } from '../../../modules/routing/locations'
import { AssetImage } from '../../AssetImage'
import { AssetProviderPage } from '../../AssetProviderPage'
import { Footer } from '../../Footer'
import { Column } from '../../Layout/Column'
import { Row } from '../../Layout/Row'
import { Navbar } from '../../Navbar'
import { Props } from './StatusPage.types'
import './StatusPage.css'

const StatusPage = ({ type, purchase }: Props) => {
  if (!purchase) return <Redirect to={{ pathname: locations.root() }} />

  const { status } = purchase

  return (
    <>
      <Navbar isFullscreen />
      <Page className="StatusPage">
        <AssetProviderPage type={type}>
          {asset => (
            <div className="Status">
              <Row>
                <Column align="center">
                  <div className="asset-image-wrapper">
                    <AssetImage asset={asset} zoom={1} />
                  </div>
                  <Header className="title" size="large">
                    {t(`asset_purchase_with_card_${status}_page.title`)}
                  </Header>
                  {status === PurchaseStatus.PENDING ? (
                    <div className="status-wrapper">
                      <Loader size="small" active inline />
                      <p className="status">
                        {t(`asset_purchase_with_card_${status}_page.status`)}
                      </p>
                    </div>
                  ) : null}
                  <p className="description">
                    {t(`asset_purchase_with_card_${status}_page.description`, {
                      activity: (
                        <a href={locations.activity()}>
                          {t('navigation.activity')}
                        </a>
                      ),
                      my_assets: (
                        <a href={locations.defaultCurrentAccount()}>
                          {t('navigation.my_assets')}
                        </a>
                      )
                    })}
                  </p>
                  <Button
                    className="cta"
                    as={Link}
                    to={locations.browse()}
                    inverted
                    primary
                    fluid
                  >
                    {t(`asset_purchase_with_card_${status}_page.cta`)}
                  </Button>
                </Column>
              </Row>
            </div>
          )}
        </AssetProviderPage>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(StatusPage)
