import React from 'react'
import { Loader } from 'decentraland-ui'
import { Item } from '@dcl/schemas'
import { Props } from './CollectionImage.types'
import { AssetImage } from '../AssetImage'
import classNames from 'classnames'
import CollectionProvider from '../CollectionProvider'

import './CollectionImage.css'

const CollectionImage = ({ contractAddress }: Props) => {
  const renderRow = (items: Item[]) =>
    items.map((item, index) => <AssetImage key={index} asset={item} />)

  return (
    <CollectionProvider contractAddress={contractAddress} withItems>
      {({ items, isLoading }) => {
        if (isLoading) {
          return (
            <div className="item-row">
              <Loader active size="tiny" inline />
            </div>
          )
        }

        if (!items) {
          return null
        }

        const row1 = items.slice(0, 2)
        const row2 = items.slice(2, 4)
        const rowHeight = { height: row2.length ? '50%' : '100%' }

        if (items?.length === 0) {
          return <div className="item-row empty" />
        }

        return (
          <>
            {row1.length > 0 ? (
              <div
                className={classNames(
                  'item-row',
                  items?.length === 2 && 'full-width-image'
                )}
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
        )
      }}
    </CollectionProvider>
  )
}

export default React.memo(CollectionImage)
