import { Button, Close, Header, Icon, Modal } from 'decentraland-ui'
import { Asset } from '../../../../modules/asset/types'
import { formatWeiMANA } from '../../../../lib/mana'
import { Mana } from '../../../Mana'
import { AssetImage } from '../../../AssetImage'
import { Network } from '@dcl/schemas'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import Lottie from 'react-lottie-player'

import lottieJson from './lottie.json'

export default function BuyModal({
  items,
  onClose
}: {
  items: Asset[]
  onClose: () => void
}) {
  const [showConfirmationPage, setShowConfirmationPage] = useState(false)
  const price = items.reduce(
    (sum, asset) =>
      ('price' in asset ? BigNumber.from(asset.price) : BigNumber.from(0)).add(
        sum
      ),
    BigNumber.from(0)
  )

  if (showConfirmationPage) {
    return (
      <Modal
        open
        closeIcon={<Close />}
        onClose={onClose}
        style={{ position: 'relative', width: '600px', height: '600px' }}
      >
        <div
          style={{
            width: '600px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span
            style={{
              fontSize: '30px',
              fontWeight: '500',
              marginBottom: '20px'
            }}
          >
            Congratulations!
          </span>
          <div style={{ display: 'flex', marginTop: '20px', gap: '10px' }}>
            {items.map(item => (
              <AssetImage asset={item} className="buy-final-images" />
            ))}
          </div>
          <span style={{ fontSize: '18px', fontWeight: '500', marginTop: '20px' }}>
            Go to My Assets to see your new items
          </span>
        </div>
        <Lottie
          loop
          animationData={lottieJson}
          play
          style={{ width: 600, height: 600, position: 'absolute', top: 0 }}
        />
      </Modal>
    )
  }

  return (
    <Modal className="cart-modal" open closeIcon={<Close />} onClose={onClose}>
      <Header>Buy items</Header>
      <div className="buy-grid">
        <span className="cart-modal-title">Item</span>
        <span className="cart-modal-title" style={{ textAlign: 'right' }}>
          Price
        </span>
        {items.map(asset => (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <AssetImage asset={asset} className="cart-image" />
              <span className="hackathon-item-name">{asset.name}</span>
            </div>
            <Mana
              className="cart-mana"
              showTooltip
              network={asset.network}
              inline
            >
              {formatWeiMANA('price' in asset ? asset.price : '')}
            </Mana>
            <div className="row-border"></div>
          </>
        ))}
      </div>
      <div className="cart-total">
        <span>TOTAL</span>
        <Mana
          showTooltip
          network={Network.MATIC}
          inline
          className="cart-total-mana"
        >
          {formatWeiMANA(price.toString())}
        </Mana>
      </div>
      <Button
        primary
        className="cart-button"
        onClick={() => setShowConfirmationPage(true)}
      >
        <Mana showTooltip inline size="small" network={Network.MATIC} />
        Buy with MANA
      </Button>
      <Button
        secondary
        className="cart-button"
        onClick={() => setShowConfirmationPage(true)}
      >
        <Icon name="credit card" />
        Buy with card
      </Button>
    </Modal>
  )
}
