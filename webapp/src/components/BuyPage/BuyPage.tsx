import React from 'react'
import { fromWei } from 'web3x-es/utils'
import { Item } from '@dcl/schemas'
import { Page } from 'decentraland-ui'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet as WalletProvider } from '../Wallet'
import { AssetProviderPage } from '../AssetProviderPage'
import { NFT } from '../../modules/nft/types'
import { isOwnedBy } from '../../modules/nft/utils'
import { Order } from '../../modules/order/types'
import { Asset, ResultType } from '../../modules/routing/types'
import { BuyNFTModal } from './BuyNFTModal'
import { BuyItemModal } from './BuyItemModal'
import { Props } from './BuyPage.types'
import './BuyPage.css'

const BuyPage = (props: Props) => {
  const {
    type,
    authorizations,
    isLoading,
    onNavigate,
    onExecuteOrder,
    onBuyItem,
    isExecutingOrder
  } = props

  const isInsufficientMANA = (
    wallet: Wallet,
    asset: Asset,
    order: Order | null
  ) =>
    !!order &&
    wallet.networks[asset.network].mana < +fromWei(order.price, 'ether')

  return (
    <>
      <Navbar isFullscreen />
      <Page className="BuyPage">
        <WalletProvider>
          {wallet => (
            <AssetProviderPage type={type}>
              {(asset, order) => {
                const props = {
                  wallet: wallet,
                  authorizations: authorizations,
                  isLoading: isLoading || isExecutingOrder,
                  onNavigate: onNavigate,
                  isOwner: isOwnedBy(asset, wallet),
                  hasInsufficientMANA: isInsufficientMANA(wallet, asset, order)
                }
                return type === ResultType.NFT ? (
                  <BuyNFTModal
                    nft={asset as NFT}
                    order={order}
                    onExecuteOrder={onExecuteOrder}
                    {...props}
                  />
                ) : type === ResultType.ITEM ? (
                  <BuyItemModal
                    item={asset as Item}
                    onBuyItem={onBuyItem}
                    {...props}
                  />
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
