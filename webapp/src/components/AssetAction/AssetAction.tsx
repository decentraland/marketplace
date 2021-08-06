import React from 'react'
import { Link } from 'react-router-dom'

import { getAssetUrl } from '../../modules/asset/utils'
import { AssetImage } from '../AssetImage'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { Props } from './AssetAction.types'
import './AssetAction.css'

const AssetAction = (props: Props) => {
  const { asset, children } = props
  return (
    <div className="AssetAction">
      <Link to={getAssetUrl(asset)}>
        <div className="back" />
      </Link>
      <Row>
        <Column align="left">
          <div className="asset-image-wrapper">
            <AssetImage asset={asset} zoom={1} />
          </div>
        </Column>
        <Column align="right">{children}</Column>
      </Row>
    </div>
  )
}

export default React.memo(AssetAction)
