import { useEffect, useState } from 'react'
import { TokenConverter } from '../vendor/TokenConverter'
import { MarketplacePrice } from '../vendor/MarketplacePrice'
import { isPartner } from '../vendor/utils'
import { Order } from '../order/types'
import { getFingerprint } from './estate/utils'
import { NFT, NFTCategory } from './types'

export const useFingerprint = (nft: NFT | null) => {
  const [fingerprint, setFingerprint] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (nft) {
      switch (nft.category) {
        case NFTCategory.ESTATE: {
          setIsLoading(true)
          getFingerprint(nft.tokenId)
            .then(result => setFingerprint(result))
            .finally(() => setIsLoading(false))
            .catch(error =>
              console.error(
                `Error getting fingerprint for nft ${nft.tokenId}`,
                error
              )
            )
          break
        }
        default:
          break
      }
    }
  }, [nft, setFingerprint, setIsLoading])

  return [fingerprint, isLoading] as const
}

export const useComputedPrice = (nft: NFT, order: Order | null) => {
  const [computedPrice, setComputedPrice] = useState<string>()
  const [percentageIncrease, setPercentageIncrease] = useState(0)
  const [isAboveMaxPercentage, setIsAboveMaxPercentage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (order && isPartner(nft.vendor)) {
      const tokenConverter = new TokenConverter()
      const marketPrice = new MarketplacePrice()

      setIsLoading(true)
      tokenConverter
        .contractEthToMANA(order.ethPrice!)
        .then(computedPrice => {
          const percentage = marketPrice.getPercentageIncrease(
            computedPrice,
            order.price
          )

          setComputedPrice(computedPrice)
          setPercentageIncrease(percentage)
          setIsAboveMaxPercentage(
            marketPrice.isAboveMaxIncreasePercentage(percentage)
          )
        })
        .finally(() => setIsLoading(false))
        .catch(error =>
          console.error(
            `Error getting computed price for nft ${nft.tokenId} from ${nft.vendor}`,
            error
          )
        )
    }
  }, [
    nft,
    order,
    setComputedPrice,
    setPercentageIncrease,
    setIsAboveMaxPercentage,
    setIsLoading
  ])

  return [
    computedPrice,
    percentageIncrease,
    isAboveMaxPercentage,
    isLoading
  ] as const
}
