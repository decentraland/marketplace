import React from 'react'
import { Back } from 'decentraland-ui'
import { getAssetUrl } from '../../modules/asset/utils'
import { AssetImage } from '../AssetImage'
import { Column } from '../Layout/Column'
import { Row } from '../Layout/Row'
import { Props } from './AssetAction.types'
import './AssetAction.css'

const AssetAction = (props: Props) => {
  const { asset, children, onBack, strictEstateSelection } = props
  return (
    <div className="AssetAction">
      <Back onClick={() => onBack(getAssetUrl(asset))} />
      <Row>
        <Column align="left">
          <div className="asset-image-wrapper">
            <AssetImage asset={asset} zoom={1} strictEstateSelection={strictEstateSelection} />
          </div>
        </Column>
        <Column align="right">{children}</Column>
      </Row>
    </div>
  )
}

export default React.memo(AssetAction)
