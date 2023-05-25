import React from 'react'
import classNames from 'classnames'
import { Back, Container } from 'decentraland-ui'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { isNFT, mapAsset } from '../../../modules/asset/utils'
import { AssetType } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { Sections } from '../../../modules/routing/types'
import { Box } from '../../AssetBrowse/Box'
// TODO: make it importable from the root directory as AssetDetails or AssetDetailsBox
import { DetailsBox } from '../../DetailsBox'
import { FavoritesCounter } from '../../FavoritesCounter'
import { PageHeader } from '../../PageHeader'
import Title from '../Title'
import { Props } from './BaseDetail.types'
import './BaseDetail.css'

const BaseDetail = ({
  asset,
  rental,
  assetImage,
  badges,
  left,
  box,
  below,
  className,
  actions,
  showDetails,
  onBack
}: Props) => {
  const isMobile = useMobileMediaQuery()

  return (
    <div className={classNames('BaseDetail', className)}>
      <div className="top-header" data-testid="top-header">
        <Back
          className="back"
          absolute
          onClick={() =>
            onBack(
              mapAsset(
                asset,
                {
                  wearable: () =>
                    locations.browse({
                      assetType: AssetType.ITEM,
                      section: Sections.decentraland.WEARABLES
                    }),
                  emote: () =>
                    locations.browse({
                      assetType: AssetType.ITEM,
                      section: Sections.decentraland.EMOTES
                    })
                },
                {
                  ens: () =>
                    locations.browse({
                      assetType: AssetType.NFT,
                      section: Sections.decentraland.ENS
                    }),
                  estate: () =>
                    locations.lands({
                      assetType: AssetType.NFT,
                      section: Sections.decentraland.ESTATES,
                      isMap: false,
                      isFullscreen: false
                    }),
                  parcel: () =>
                    locations.lands({
                      assetType: AssetType.NFT,
                      section: Sections.decentraland.PARCELS,
                      isMap: false,
                      isFullscreen: false
                    }),
                  wearable: () =>
                    locations.browse({
                      assetType: AssetType.NFT,
                      section: Sections.decentraland.WEARABLES
                    }),
                  emote: () =>
                    locations.browse({
                      assetType: AssetType.NFT,
                      section: Sections.decentraland.EMOTES
                    })
                },
                () => undefined
              )
            )
          }
        />
        {isMobile && !isNFT(asset) ? (
          <FavoritesCounter isCollapsed className="favorites" item={asset} />
        ) : null}
      </div>
      <PageHeader>{assetImage}</PageHeader>
      <Container>
        <div className="info">
          <div className="left">
            <div>
              <Title asset={asset} />
              <div className="badges">{badges}</div>
            </div>
            {left}
          </div>
          <div className="right">
            {showDetails && actions ? (
              <div className="action-box">{actions}</div>
            ) : null}
            {showDetails ? (
              <DetailsBox rental={rental} asset={asset} />
            ) : (
              <Box className="box" childrenClassName="box-children">
                {box}
              </Box>
            )}
          </div>
        </div>
        {below}
      </Container>
    </div>
  )
}

export default React.memo(BaseDetail)
