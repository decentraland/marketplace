import { Network } from '@dcl/schemas'
import { OutfitView } from './OutfitView'
import { AssetImage } from '../../AssetImage'
import { WearableCategory } from '@dcl/schemas'
import './PreviewMode.css'
import { Mana } from '../../Mana'
import { formatWeiMANA } from '../../../lib/mana'
import { Props } from './PreviewMode.types'
import { InfiniteScroll } from '../../InfiniteScroll'
import { useCallback, useEffect, useState } from 'react'
import { MAX_PAGE } from '../../../modules/vendor/api'
import { Button, Icon, Loader } from 'decentraland-ui'
import { Asset } from '../../../modules/asset/types'
import { BigNumber } from 'ethers'
import { ManaToFiat } from '../../ManaToFiat'
import classNames from 'classnames'
import BuyModal from './BuyModal/BuyModal'

export default function PreviewMode({
  assets,
  page,
  isLoading,
  count,
  onBrowse
}: Props) {
  const hasMorePages = assets.length !== count && page <= MAX_PAGE
  const [selectedItems, setSelectedItems] = useState<Asset[]>([])
  const [showBuyModal, setShowBuyModal] = useState(false)

  const price = selectedItems.filter((asset) => asset !== undefined).reduce(
    (sum, asset) =>
      ('price' in asset ? BigNumber.from(asset.price) : BigNumber.from(0)).add(
        sum
      ),
    BigNumber.from(0)
  )

  const handleLoadMore = useCallback(
    newPage => {
      onBrowse({ page: newPage, previewMode: true })
    },
    [onBrowse]
  )

  const randomizeOutfit = useCallback(() => {
    const categories = [
      WearableCategory.HAT,
      WearableCategory.UPPER_BODY,
      WearableCategory.LOWER_BODY,
      WearableCategory.FEET,
      WearableCategory.EARRING,
      WearableCategory.EYEWEAR
    ]

    const items = categories.map(category => {
      const categoryItems = assets.filter(
        item => item.data.wearable!.category === category
      )
      const randomIndex = Math.floor(Math.random() * categoryItems.length)
      return categoryItems[randomIndex]
    })

    setSelectedItems(items.filter(Boolean))
  }, [setSelectedItems, assets])

  useEffect(() => {
    randomizeOutfit()
  }, [randomizeOutfit])

  const handleAddItem = (asset: Asset) => {
    const wasSelected = selectedItems.find(item => item.id === asset.id)
    if (wasSelected) {
      const newItems = selectedItems.filter(item => item.id !== asset.id)
      setSelectedItems(newItems.filter(Boolean))
    } else {
      const newItems = selectedItems.filter(
        item => item.data.wearable?.category !== asset.data.wearable?.category
      )
      setSelectedItems([asset, ...newItems].filter(Boolean))
    }
  }

  return (
    <div className="hackathon-preview">
      <div className="right-sidebar">
        <div className="buy-box">
          <div className="hackathon-price">
            <span className="hackathon-price-title">PRICE</span>
            <div className="price-number">
              <Mana
                showTooltip
                network={Network.MATIC}
                inline
                className="full-price-mana"
              >
                {formatWeiMANA(price.toString() || '0')}
              </Mana>
              <div className="price-mana-fiat">
                {'('}
                <ManaToFiat mana={price.toString()} />
                {')'}
              </div>
            </div>
          </div>
          <div>
            {selectedItems.map(asset => (
              <div
                onClick={() => handleAddItem(asset)}
                className="hackathon-item-selected"
                key={asset.id}
              >
                <div className="hackathon-item-info-selected">
                  <span className="hackathon-item-name">{asset.name}</span>
                  <Mana showTooltip network={asset.network} inline>
                    {formatWeiMANA('price' in asset ? asset.price : '')}
                  </Mana>
                </div>
              </div>
            ))}
          </div>

          <Button
            primary
            className="randomize-button"
            onClick={() => setShowBuyModal(true)}
          >
            <Mana showTooltip inline size="small" network={Network.MATIC} />
            Buy full outfit
          </Button>
          <Button
            secondary
            className="randomize-button"
            onClick={randomizeOutfit}
          >
            <Icon name="random" />
            Change style
          </Button>
        </div>

        <span style={{ fontSize: '16px', fontWeight: 500, marginTop: '15px' }}>
          Select a specific items
        </span>
        <div className="hackathon-list">
          {isLoading ? (
            <>
              <div className="overlay" />
              <div className="transparentOverlay">
                <Loader size="massive" active className="asset-loader" />
              </div>
            </>
          ) : null}
          <InfiniteScroll
            page={page}
            hasMorePages={hasMorePages}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            maxScrollPages={3}
          >
            <div className="hackathon-item-list">
              {assets.map(asset => {
                const isSelected =
                  selectedItems.filter(
                    selectedItem => selectedItem.id === asset.id
                  ).length === 1
                return (
                  <div
                    onClick={() => handleAddItem(asset)}
                    className={classNames('hackathon-item', {
                      'selected-item': !!isSelected
                    })}
                    key={asset.id}
                  >
                    <AssetImage
                      asset={asset}
                      className="hackathon-item-image"
                    />
                    <div className="hackathon-item-info">
                      {isSelected ? (
                        <Icon name="check circle" className="check-item" />
                      ) : null}
                      <span className="hackathon-item-name">{asset.name}</span>
                      <Mana showTooltip network={asset.network} inline>
                        {formatWeiMANA('price' in asset ? asset.price : '')}
                      </Mana>
                    </div>
                  </div>
                )
              })}
            </div>
          </InfiniteScroll>
        </div>
      </div>
      <OutfitView items={selectedItems} />
      {showBuyModal && <BuyModal items={selectedItems} onClose={() => setShowBuyModal(false)} />}
    </div>
  )
}
