import { useEffect, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { getFingerprint } from './estate/utils'
import { NFT } from './types'

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
