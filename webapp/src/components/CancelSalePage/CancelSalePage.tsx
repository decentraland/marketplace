import React from 'react'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { Page, Header, Button } from 'decentraland-ui'

import { AssetType } from '../../modules/asset/types'
import { locations } from '../../modules/routing/locations'
import { getAssetName } from '../../modules/asset/utils'
import { formatMANA } from '../../lib/mana'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { Mana } from '../Mana'
import { AssetProviderPage } from '../AssetProviderPage'
import { AssetAction } from '../AssetAction'
import { Props } from './CancelSalePage.types'
import './CancelSalePage.css'

const CancelSalePage = (props: Props) => {
  const { isLoading, onNavigate, onCancelOrder } = props

  return (
    <>
      <Navbar isFullscreen />
      <Page className="CancelSalePage">
        <Wallet>
          {wallet => (
            <AssetProviderPage type={AssetType.NFT}>
              {(nft, order) => {
                let subtitle
                let isDisabled = false
                const name = getAssetName(nft)
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
                        amount: (
                          <Mana network={nft.network} inline>
                            {formatMANA(order.price)}
                          </Mana>
                        )
                      }}
                    />
                  )
                }
                return (
                  <AssetAction asset={nft}>
                    <Header size="large">{t('cancel_sale_page.title')}</Header>
                    <div className="subtitle">{subtitle}</div>
                    <div className="buttons">
                      <Button
                        onClick={() =>
                          onNavigate(
                            locations.nft(nft.contractAddress, nft.tokenId)
                          )
                        }
                      >
                        {t('global.cancel')}
                      </Button>
                      <ChainButton
                        primary
                        loading={isLoading}
                        disabled={isDisabled || isLoading}
                        onClick={() => onCancelOrder(order!, nft)}
                        chainId={nft.chainId}
                      >
                        {t('cancel_sale_page.submit')}
                      </ChainButton>
                    </div>
                  </AssetAction>
                )
              }}
            </AssetProviderPage>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(CancelSalePage)
