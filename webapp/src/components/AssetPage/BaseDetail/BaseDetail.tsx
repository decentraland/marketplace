import React from 'react'
import classNames from 'classnames'
import { Container } from 'decentraland-ui'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { isNFT } from '../../../modules/asset/utils'
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
  isFavoritesEnabled
}: Props) => {
  const isMobile = useMobileMediaQuery()

  return (
    <div className={classNames('BaseDetail', className)}>
      {isFavoritesEnabled && isMobile && !isNFT(asset) ? (
        <FavoritesCounter isCollapsed className="favorites" item={asset} />
      ) : null}
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
