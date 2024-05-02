import React from 'react'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Page, Header, Button } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { AssetType } from '../../modules/asset/types'
import { getAssetName } from '../../modules/asset/utils'
import { locations } from '../../modules/routing/locations'
import { AssetAction } from '../AssetAction'
import { AssetProviderPage } from '../AssetProviderPage'
import { Mana } from '../Mana'
import { PageLayout } from '../PageLayout'
import { Wallet } from '../Wallet'
import { Props } from './CancelSalePage.types'
import './CancelSalePage.css'

const CancelSalePage = (props: Props) => {
  const { isLoading, onNavigate, onCancelOrder } = props

  return (
    <PageLayout>
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
                  subtitle = <T id="cancel_sale_page.not_for_sale" values={{ name: <b>{name}</b> }} />
                } else if (order.owner !== wallet.address) {
                  isDisabled = true
                  subtitle = <T id="cancel_sale_page.invalid_owner" values={{ name: <b>{name}</b> }} />
                } else {
                  subtitle = (
                    <T
                      id="cancel_sale_page.subtitle"
                      values={{
                        name: <b>{name}</b>,
                        amount: (
                          <Mana showTooltip network={nft.network} inline>
                            {formatWeiMANA(order.price)}
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
                      <Button onClick={() => onNavigate(locations.nft(nft.contractAddress, nft.tokenId))}>{t('global.cancel')}</Button>
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
    </PageLayout>
  )
}

export default React.memo(CancelSalePage)
