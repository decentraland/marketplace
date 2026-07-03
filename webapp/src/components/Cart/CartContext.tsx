import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { Network } from '@dcl/schemas'

// NOTE: demo-only shopping cart. Client-side state (persisted to localStorage),
// no backend / no real checkout — just to showcase the UX.

export type CartItem = {
  id: string
  name: string
  thumbnail: string
  price: string // MANA in wei
  network: Network
  // Wearable/emote urn, used by the fitting room to dress the avatar.
  urn?: string
  // Body slot (wearable category, or 'emote') — items sharing it replace each
  // other on the avatar, so the fitting room swaps instead of stacking them.
  category?: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  isInCart: (id: string) => boolean
  clear: () => void
}

const STORAGE_KEY = 'demo-cart'

const CartContext = createContext<CartContextValue>({
  items: [],
  count: 0,
  addItem: () => undefined,
  removeItem: () => undefined,
  isInCart: () => false,
  clear: () => undefined
})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore persistence errors (demo only)
    }
  }, [items])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => (prev.some(i => i.id === item.id) ? prev : [...prev, item]))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const isInCart = useCallback((id: string) => items.some(i => i.id === id), [items])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(
    () => ({ items, count: items.length, addItem, removeItem, isInCart, clear }),
    [items, addItem, removeItem, isInCart, clear]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
