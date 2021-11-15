import * as React from 'react'
import { Loader } from 'decentraland-ui'
import { Props } from './CollectionImage.types'
import './CollectionImage.css'
import { AssetImage } from '../AssetImage'
import { Item } from '@dcl/schemas'

export default class CollectionImage extends React.PureComponent<Props> {
  renderItemRow(items: Item[]) {
    return items.map((item, index) => <AssetImage key={index} asset={item} />)
  }

  render() {
    let { items, isLoading } = this.props

    const firstItemRow = items.slice(0, 2)
    const secondItemRow = items.slice(2, 4)
    const itemRowStyle = { height: secondItemRow.length ? '50%' : '100%' }

    return (
      <div className="CollectionImage">
        {isLoading ? (
          <div className="item-row">
            <Loader active size="tiny" inline />
          </div>
        ) : items.length === 0 ? (
          <div className="item-row empty" />
        ) : (
          <>
            {firstItemRow.length > 0 ? (
              <div
                className={
                  'item-row' + (items.length === 2 ? ' full-width-image' : '')
                }
                style={itemRowStyle}
              >
                {this.renderItemRow(firstItemRow)}
              </div>
            ) : null}
            {secondItemRow.length > 0 ? (
              <div className="item-row" style={itemRowStyle}>
                {this.renderItemRow(secondItemRow)}
              </div>
            ) : null}
          </>
        )}
      </div>
    )
  }
}
