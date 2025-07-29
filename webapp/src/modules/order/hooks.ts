import { useSelector } from 'react-redux'
import { useGetCurrentNFT } from '../nft/hooks'
import { getData } from './selectors'
import { getActiveOrder } from './utils'

export const useGetCurrentOrder = () => {
  const nft = useGetCurrentNFT()
  const orders = useSelector(getData)
  return getActiveOrder(nft, orders)
}
