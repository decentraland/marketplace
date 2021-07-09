import React, { useEffect } from 'react'
import { Page, Loader } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { VendorFactory } from '../../modules/vendor/VendorFactory'
import { nftAPI } from '../../modules/vendor/decentraland/nft/api'
import { VendorName } from '../../modules/vendor/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Props } from './LegacyNFTPage.types'
import { NFTCategory } from '../../modules/nft/types'
import { getContract } from '../../modules/contract/utils'

const LegacyNFTPage = (props: Props) => {
  const { match, history } = props
  const { params } = match
  const { contractService } = VendorFactory.build(VendorName.DECENTRALAND)

  useEffect(() => {
    const { estateId, x, y } = params

    const land = getContract({ category: NFTCategory.PARCEL })
    const estates = getContract({ category: NFTCategory.ESTATE })

    if (estateId) {
      history.replace(locations.nft(estates.address, estateId))
    } else if (x && y) {
      nftAPI
        .fetchTokenId(Number(x), Number(y))
        .then(tokenId => {
          history.replace(locations.nft(land.address, tokenId))
        })
        .catch(() => history.replace(locations.root()))
    }
  }, [contractService, params, history])

  return (
    <>
      <Navbar isFullscreen />
      <Page className="LegacyNFTPage" isFullscreen>
        <Loader size="massive" active />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(LegacyNFTPage)
