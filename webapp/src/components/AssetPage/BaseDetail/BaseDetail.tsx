import React from 'react'
import classNames from 'classnames'
import { Container } from 'decentraland-ui'
import { PageHeader } from '../../PageHeader'
import Title from '../Title'
import { Box } from '../../AssetBrowse/Box'
// TODO: make it importable from the root directory as AssetDetails or AssetDetailsBox
import { DetailsBox } from '../../DetailsBox'
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
  showDetails
}: Props) => {
  return (
    <div className={classNames('BaseDetail', className)}>
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
