import React from 'react'
import { Container } from 'decentraland-ui'
import { PageHeader } from '../../PageHeader'
import Title from '../Title'
import { Box } from '../../AssetBrowse/Box'
import ListedBadge from '../../ListedBadge'
import { Props } from './BaseDetail.types'
import './BaseDetail.css'

const BaseDetail = ({
  asset,
  assetImage,
  isOnSale,
  badges,
  left,
  box,
  below
}: Props) => {
  return (
    <div className="BaseDetail">
      <PageHeader>
        {assetImage}
        {isOnSale && <ListedBadge className="BaseDetail listed-badge" />}
      </PageHeader>
      <Container>
        <div className="BaseDetail info">
          <div className="BaseDetail left">
            <div>
              <Title asset={asset} />
              <div className="BaseDetail badges">{badges}</div>
            </div>
            {left}
          </div>
          <div className="BaseDetail right">
            <Box
              className="BaseDetail box"
              childrenClassName="BaseDetail box-children"
            >
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
