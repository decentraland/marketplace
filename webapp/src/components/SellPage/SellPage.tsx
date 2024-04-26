import React from 'react'
import { Page } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { AssetProviderPage } from '../AssetProviderPage'
import { PageLayout } from '../PageLayout'
import { Wallet } from '../Wallet'
import { SellModal } from './SellModal'
import { Props } from './SellPage.types'
import './SellPage.css'

const SellPage = (props: Props) => {
  const { isLoading, isCreatingOrder, onGoBack, getContract, onCreateOrder, onClearOrderErrors } = props
  return (
    <PageLayout>
      <Page className="SellPage">
        <Wallet>
          {wallet => (
            <AssetProviderPage type={AssetType.NFT}>
              {(nft, order) => (
                <SellModal
                  nft={nft}
                  order={order}
                  wallet={wallet}
                  isLoading={isLoading}
                  isCreatingOrder={isCreatingOrder}
                  onGoBack={onGoBack}
                  onCreateOrder={onCreateOrder}
                  getContract={getContract}
                  onClearOrderErrors={onClearOrderErrors}
                />
              )}
            </AssetProviderPage>
          )}
        </Wallet>
      </Page>
    </PageLayout>
  )
}

export default React.memo(SellPage)
