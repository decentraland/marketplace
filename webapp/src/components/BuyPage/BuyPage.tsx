import React from 'react'
import { fromWei } from 'web3x-es/utils'
import { Page } from 'decentraland-ui'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProviderPage } from '../NFTProviderPage'
import { isOwnedBy } from '../../modules/nft/utils'
import { BuyModal } from './BuyModal'
import { Props } from './BuyPage.types'
import './BuyPage.css'

const BuyPage = (props: Props) => {
  const { onNavigate, onExecuteOrder } = props

  return (
    <>
      <Navbar isFullscreen />
      <Page className="BuyPage">
        <Wallet>
          {wallet => (
            <NFTProviderPage>
              {(nft, order) => (
                <BuyModal
                  nft={nft}
                  order={order}
                  onNavigate={onNavigate}
                  onExecuteOrder={onExecuteOrder}
                  isOwner={isOwnedBy(nft, wallet)}
                  notEnoughMana={
                    !!order && wallet.mana < +fromWei(order.price, 'ether')
                  }
                />
              )}
            </NFTProviderPage>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(BuyPage)
