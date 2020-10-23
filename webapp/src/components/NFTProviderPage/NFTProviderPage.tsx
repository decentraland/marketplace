import React from 'react'
import { Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFTProvider } from '../NFTProvider'
import { Props } from './NFTProviderPage.types'

const Loading = () => (
  <div className="nft-center">
    <Loader active size="huge" />
  </div>
)

const NotFound = () => (
  <div className="nft-center">
    <p className="secondary-text">{t('global.not_found')}&hellip;</p>
  </div>
)

const NFTProviderPage = (props: Props) => {
  const { isConnecting, children } = props
  return (
    <NFTProvider>
      {(nft, order, isLoading) => (
        <>
          {isConnecting || isLoading ? <Loading /> : null}
          {!isConnecting && !isLoading && !nft ? <NotFound /> : null}
          {!isConnecting && !isLoading && nft ? children(nft, order) : null}
        </>
      )}
    </NFTProvider>
  )
}

export default React.memo(NFTProviderPage)
