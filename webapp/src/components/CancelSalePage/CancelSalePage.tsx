import React from 'react'
import { Page, Header, Button, Mana } from 'decentraland-ui'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProviderPage } from '../NFTProviderPage'
import { Props } from './CancelSalePage.types'
import './CancelSalePage.css'
import NFTAction from '../NFTAction/NFTAction'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { getNFTName } from '../../modules/nft/utils'
import { formatMANA } from '../../lib/api/mana'

const CancelSalePage = (props: Props) => {
  const { onNavigate, onCancelOrder } = props

  return (
    <>
      <Navbar isFullscreen />
      <Page className="CancelSalePage">
        <Wallet>
          {wallet => (
            <NFTProviderPage>
              {(nft, order) => {
                let subtitle
                let isDisabled = false
                const name = getNFTName(nft)
                if (!order) {
                  isDisabled = true
                  subtitle = (
                    <T
                      id="cancel_sale_page.not_for_sale"
                      values={{ name: <b>{name}</b> }}
                    />
                  )
                } else if (order.owner !== wallet.address) {
                  isDisabled = true
                  subtitle = (
                    <T
                      id="cancel_sale_page.invalid_owner"
                      values={{ name: <b>{name}</b> }}
                    />
                  )
                } else {
                  subtitle = (
                    <T
                      id="cancel_sale_page.subtitle"
                      values={{
                        name: <b>{name}</b>,
                        amount: <Mana inline>{formatMANA(order.price)}</Mana>
                      }}
                    />
                  )
                }
                return (
                  <NFTAction nft={nft} onNavigate={onNavigate}>
                    <Header size="large">{t('cancel_sale_page.title')}</Header>
                    <div className="subtitle">{subtitle}</div>
                    <div className="buttons">
                      <Button
                        onClick={() =>
                          onNavigate(
                            locations.ntf(nft.contractAddress, nft.tokenId)
                          )
                        }
                      >
                        {t('global.cancel')}
                      </Button>
                      <Button
                        primary
                        disabled={isDisabled}
                        onClick={() => onCancelOrder(order!, nft)}
                      >
                        {t('cancel_sale_page.submit')}
                      </Button>
                    </div>
                  </NFTAction>
                )
              }}
            </NFTProviderPage>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(CancelSalePage)
