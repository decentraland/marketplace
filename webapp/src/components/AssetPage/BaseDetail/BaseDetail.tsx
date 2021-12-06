import React from 'react'
import { Container } from 'decentraland-ui'
import { AssetImage } from '../../AssetImage'
import { PageHeader } from '../../PageHeader'
import Title from '../Title'
import { Box } from '../../AssetBrowse/Box'
import ListedBadge from '../../ListedBadge'
import { Props } from './BaseDetail.types'
import './BaseDetail.css'

const BaseDetail = ({
  asset,
  assetImageProps,
  isOnSale,
  badges,
  left,
  box,
  below
}: Props) => {
  return (
    <div className="BaseDetail">
      <PageHeader>
        <AssetImage asset={asset} {...assetImageProps} />
        {isOnSale && <ListedBadge className="listedBadge" />}
      </PageHeader>
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
            <Box className="box" childrenClassName="boxChildren">
              {box}
            </Box>
          </div>
        </div>
        {below}
      </Container>
    </div>
  )
}

export default React.memo(BaseDetail)
