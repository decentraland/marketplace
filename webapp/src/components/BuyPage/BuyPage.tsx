import React, { useCallback } from 'react'
import { ethers } from 'ethers'
import { Item, Network } from '@dcl/schemas'
import {
  Button,
  Header,
  Icon,
  Page,
  useMobileMediaQuery
} from 'decentraland-ui'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import ChainProvider from 'decentraland-dapps/dist/containers/ChainProvider'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet as WalletProvider } from '../Wallet'
import { AssetProviderPage } from '../AssetProviderPage'
import { NFT } from '../../modules/nft/types'
import { config } from '../../config'
import { isOwnedBy } from '../../modules/asset/utils'
import { AssetType } from '../../modules/asset/types'
import { BuyNFTModal } from './BuyNFTModal'
import { MintItemModal } from './MintItemModal'
import { isPriceTooLow } from './utils'
import { Props } from './BuyPage.types'
import './BuyPage.css'

const BuyPage = (props: Props) => {
  const { type, appChainId, onSwitchNetwork } = props

  const isInsufficientMANA = (
    wallet: Wallet,
    network: Network,
    price: string
  ) => wallet.networks[network].mana < +ethers.utils.formatEther(price)

  const handleSwitchNetwork = useCallback(() => onSwitchNetwork(appChainId), [
    appChainId,
    onSwitchNetwork
  ])

  const isMobile = useMobileMediaQuery()

  const POLYGON_DOCS_URL = `${config.get(
    'DOCS_URL'
  )}/player/blockchain-integration/transactions-in-polygon/`

  return (
    <>
      <Navbar isFullscreen showPartiallySupportedModal={false} />
      <ChainProvider>
        {({ isPartiallySupported }) =>
          isPartiallySupported ? (
            <div className="network-warning" aria-live="polite">
              <div className="description">
                <Icon
                  className="warning-icon"
                  name="warning sign"
                  size="big"
                  color="yellow"
                />
                <div>
                  <Header as="h4" className="title">
                    {t('buy_page.switch_network_warning.title')}
                  </Header>
                  <p>
                    {t(
                      `buy_page.switch_network_warning.${
                        isMobile ? 'mobile' : 'desktop'
                      }_content`,
                      {
                        a: (children: React.ReactElement) => (
                          <a
                            href={POLYGON_DOCS_URL}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {children}
                          </a>
                        )
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="action">
                <Button inverted onClick={handleSwitchNetwork}>
                  {t('buy_page.switch_network_warning.action')}
                </Button>
              </div>
            </div>
          ) : null
        }
      </ChainProvider>
      <Page className="BuyPage">
        <WalletProvider>
          {wallet => (
            <AssetProviderPage type={type}>
              {(asset, order) => {
                const network = (order || asset)?.network
                const price =
                  type === AssetType.ITEM
                    ? (asset as Item).price
                    : order
                    ? order.price
                    : ''

                const modalProps = {
                  wallet: wallet,
                  isOwner: isOwnedBy(asset, wallet),
                  hasInsufficientMANA: isInsufficientMANA(
                    wallet,
                    network,
                    price
                  ),
                  hasLowPrice:
                    wallet.chainId !== asset.chainId && isPriceTooLow(price)
                }

                return type === AssetType.NFT ? (
                  <BuyNFTModal
                    nft={asset as NFT}
                    order={order}
                    {...modalProps}
                  />
                ) : type === AssetType.ITEM ? (
                  <MintItemModal item={asset as Item} {...modalProps} />
                ) : null
              }}
            </AssetProviderPage>
          )}
        </WalletProvider>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(BuyPage)
