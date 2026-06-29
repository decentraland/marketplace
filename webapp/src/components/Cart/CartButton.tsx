import { useEffect, useMemo, useRef, useState } from 'react'
import { BigNumber } from 'ethers'
import { Network } from '@dcl/schemas'
import { Icon } from 'decentraland-ui'
import { formatWeiToAssetCard } from '../AssetCard/utils'
import { Mana } from '../Mana'
import { useCart } from './CartContext'
import './CartButton.css'

export const CartButton = () => {
  const { items, count, removeItem } = useCart()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const totalWei = useMemo(
    () => items.reduce((acc, item) => acc.add(BigNumber.from(item.price || '0')), BigNumber.from(0)).toString(),
    [items]
  )

  return (
    <div className="CartButton" ref={ref}>
      <button type="button" className="CartButton__trigger" onClick={() => setOpen(prev => !prev)} aria-label="Shopping cart">
        <Icon name="shopping cart" />
        {count > 0 ? <span className="CartButton__badge">{count}</span> : null}
      </button>

      {open ? (
        <div className="CartPanel" role="dialog">
          <div className="CartPanel__header">Shopping cart ({count})</div>

          <div className="CartPanel__items">
            {items.length === 0 ? (
              <div className="CartPanel__empty">Your cart is empty</div>
            ) : (
              items.map(item => (
                <div className="CartPanel__item" key={item.id}>
                  <div className="CartPanel__thumb" style={{ backgroundImage: `url(${item.thumbnail})` }} />
                  <div className="CartPanel__info">
                    <span className="CartPanel__name">{item.name}</span>
                    <Mana network={item.network} inline>
                      {formatWeiToAssetCard(item.price)}
                    </Mana>
                  </div>
                  <button type="button" className="CartPanel__remove" onClick={() => removeItem(item.id)} aria-label="Remove">
                    <Icon name="close" />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 ? (
            <div className="CartPanel__footer">
              <div className="CartPanel__total">
                <span>Total: {count} items</span>
                <Mana network={items[0]?.network ?? Network.MATIC} inline>
                  {formatWeiToAssetCard(totalWei)}
                </Mana>
              </div>
              <button type="button" className="CartPanel__buy">
                BUY
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default CartButton
