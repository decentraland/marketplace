import React from 'react'
import { Page } from 'decentraland-ui'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Wallet } from '../Wallet'
import { NFTProvider } from '../NFTProvider'
import { BuyModal } from './BuyModal'
import { Props } from './BuyPage.types'
import './BuyPage.css'
import { fromWei } from 'web3x-es/utils'

const BuyPage = (props: Props) => {
  const { order, onNavigate, onExecuteOrder } = props

  return (
    <>
      <Navbar isFullscreen />
      <Page className="BuyPage">
        <Wallet>
          {wallet => (
            <NFTProvider>
              {nft => (
                <BuyModal
                  nft={nft}
                  order={order}
                  onNavigate={onNavigate}
                  onExecuteOrder={onExecuteOrder}
                  isOwner={wallet.address === nft.owner.id}
                  notEnoughMana={
                    !!order && wallet.mana < +fromWei(order.price, 'ether')
                  }
                />
              )}
            </NFTProvider>
          )}
        </Wallet>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(BuyPage)
