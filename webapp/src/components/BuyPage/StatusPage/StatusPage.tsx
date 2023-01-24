import React from 'react'
import { Button, Header, Loader, Page } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { AssetImage } from '../../AssetImage'
import { AssetProviderPage } from '../../AssetProviderPage'
import { Row } from '../../Layout/Row'
import { Navbar } from '../../Navbar'
import { Footer } from '../../Footer'
import { Column } from '../../Layout/Column'
import { Props, Status } from './StatusPage.types'
import './StatusPage.css'

const StatusPage = ({ type, status }: Props) => (
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
                  {t(`${status}_page.title`)}
                </Header>
                {status === Status.PROCESSING ? (
                  <div className="status-wrapper">
                    <Loader size="small" active inline />
                    <p className="status">{t(`${status}_page.status`)}</p>
                  </div>
                ) : null}
                <p className="description">
                  {t(`${status}_page.description`, {
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
                {/* TODO (buy nfts with card): the border should be gray */}
                <Button className="cta" inverted primary fluid>
                  {t(`${status}_page.cta`)}
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

export default React.memo(StatusPage)
