import React from 'react'
import { Loader } from 'decentraland-ui'
import { Item } from '@dcl/schemas'
import { Props } from './CollectionImage.types'
import { AssetImage } from '../AssetImage'
import './CollectionImage.css'

const CollectionImage = ({ items, isLoading }: Props) => {
  const row1 = items.slice(0, 2)
  const row2 = items.slice(2, 4)
  const rowHeight = { height: row2.length ? '50%' : '100%' }

  const renderRow = (items: Item[]) =>
    items.map((item, index) => <AssetImage key={index} asset={item} />)

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
          {row1.length > 0 ? (
            <div
              className={
                'item-row' + (items.length === 2 ? ' full-width-image' : '')
              }
              style={rowHeight}
            >
              {renderRow(row1)}
            </div>
          ) : null}
          {row2.length > 0 ? (
            <div className="item-row" style={rowHeight}>
              {renderRow(row2)}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

export default React.memo(CollectionImage)
