import { useEffect, useState } from 'react'
import { NFT, NFTCategory } from './types'
import { getFingerprint } from './estate/utils'

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
            .catch(error =>
              console.error(
                `Error getting fingerprint for nft ${nft.tokenId}`,
                error
              )
            )
            .then(() => setIsLoading(false))
          break
        }
        default:
          break
      }
    }
  }, [nft, setFingerprint, setIsLoading])

  return [fingerprint, isLoading] as const
}
