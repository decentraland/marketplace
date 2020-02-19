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
          getFingerprint(nft.tokenId).then(result => {
            setFingerprint(result)
            setIsLoading(false)
          })
          break
        }
        default:
        // nothings
      }
    }
  }, [nft, setFingerprint, setIsLoading])

  return [fingerprint, isLoading] as const
}
