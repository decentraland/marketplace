import React, { useEffect } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { Page, Loader } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { nftAPI } from '../../modules/vendor/decentraland/nft/api'
import { VendorName } from '../../modules/vendor/types'
import { VendorFactory } from '../../modules/vendor/VendorFactory'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Props } from './LegacyNFTPage.types'

const LegacyNFTPage = (props: Props) => {
  const { match, history, getContract } = props
  const { params } = match
  const { contractService } = VendorFactory.build(VendorName.DECENTRALAND)

  useEffect(() => {
    const { estateId, x, y } = params

    const land = getContract({ category: NFTCategory.PARCEL })
    const estates = getContract({ category: NFTCategory.ESTATE })

    if (estates && land) {
      if (estateId) {
        history.replace(locations.nft(estates.address, estateId))
      } else if (x && y) {
        nftAPI
          .fetchTokenId(Number(x), Number(y))
          .then(tokenId => {
            history.replace(locations.nft(land.address, tokenId ?? undefined))
          })
          .catch(() => history.replace(locations.root()))
      }
    }
  }, [contractService, params, history, getContract])

  return (
    <>
      <Navbar />
      <Page className="LegacyNFTPage" isFullscreen>
        <Loader size="massive" active />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(LegacyNFTPage)
