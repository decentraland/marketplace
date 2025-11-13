import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ListingStatus, Order, OrderSortBy } from '@dcl/schemas'
import { useGetCurrentNFT } from '../nft/hooks'
import { marketplaceOrderAPI } from '../vendor/decentraland/order/api'
import { getData } from './selectors'
import { getActiveOrder } from './utils'

export const useGetCurrentOrder = () => {
  const nft = useGetCurrentNFT()
  const orders = useSelector(getData)
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const orderFromState = getActiveOrder(nft, orders)

  useEffect(() => {
    let cancel = false

    const fetchOrder = async () => {
      if (!nft || orderFromState || isLoading) {
        return
      }

      setIsLoading(true)

      try {
        const response = await marketplaceOrderAPI.fetchOrders(
          {
            contractAddress: nft.contractAddress,
            tokenId: nft.tokenId,
            status: ListingStatus.OPEN,
            first: 1
          },
          OrderSortBy.CHEAPEST
        )

        if (!cancel && response.data.length > 0) {
          setFetchedOrder(response.data[0])
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        if (!cancel) {
          setIsLoading(false)
        }
      }
    }

    void fetchOrder()

    return () => {
      cancel = true
    }
  }, [nft, orderFromState, isLoading])

  useEffect(() => {
    setFetchedOrder(null)
    setIsLoading(false)
  }, [nft?.id])

  return orderFromState || fetchedOrder
}
