import React, { useEffect } from 'react'
import { Page, Loader } from 'decentraland-ui'

import { locations } from '../../modules/routing/locations'
import { VendorFactory } from '../../modules/vendor/VendorFactory'
import { nftAPI } from '../../modules/vendor/decentraland/nft/api'
import { Vendors } from '../../modules/vendor/types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Props } from './LegacyNFTPage.types'

const LegacyNFTPage = (props: Props) => {
  const { match, history } = props
  const { params } = match
  const { contractService } = VendorFactory.build(Vendors.DECENTRALAND)

  useEffect(() => {
    const { LANDRegistry, EstateRegistry } = contractService.contractAddresses
    const { estateId, x, y } = params

    if (estateId) {
      history.push(locations.nft(EstateRegistry, estateId))
    } else if (x && y) {
      nftAPI
        .fetchTokenId(Number(x), Number(y))
        .then(tokenId => {
          history.push(locations.nft(LANDRegistry, tokenId))
        })
        .catch(() => history.push(locations.root()))
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
