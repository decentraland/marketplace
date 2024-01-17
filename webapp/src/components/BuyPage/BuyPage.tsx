import React from 'react'
import { ethers } from 'ethers'
import { Item, Network } from '@dcl/schemas'
import { Page } from 'decentraland-ui'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet as WalletProvider } from '../Wallet'
import { AssetProviderPage } from '../AssetProviderPage'
import { NFT } from '../../modules/nft/types'
import { isOwnedBy } from '../../modules/asset/utils'
import { AssetType } from '../../modules/asset/types'
import { BuyNFTModal } from './BuyNFTModal'
import { MintItemModal } from './MintItemModal'
import { isPriceTooLow } from './utils'
import { Props } from './BuyPage.types'
import './BuyPage.css'

const BuyPage = (props: Props) => {
  const { type } = props

  const isInsufficientMANA = (
    wallet: Wallet,
    network: Network,
    price: string
  ) => wallet.networks[network].mana < +ethers.utils.formatEther(price)

  return (
    <>
      <Navbar enablePartialSupportAlert={false} />
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
