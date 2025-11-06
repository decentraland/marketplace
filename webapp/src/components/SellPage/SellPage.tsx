import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Page } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { AssetProviderPage } from '../AssetProviderPage'
import { PageLayout } from '../PageLayout'
import { Wallet } from '../Wallet'
import { SellModal } from './SellModal'
import { Props } from './SellPage.types'
import './SellPage.css'

const SellPage = (props: Props) => {
  const { isLoading, isCreatingOrder, isLoadingCancelOrder, onCancelOrder, getContract, onCreateOrder, onClearOrderErrors } = props
  const history = useHistory()
  const onGoBack = useCallback(() => {
    history.goBack()
  }, [history])
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
                  onCancelOrder={onCancelOrder}
                  isLoadingCancelOrder={isLoadingCancelOrder}
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
