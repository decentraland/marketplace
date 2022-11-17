import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NFTCategory } from '@dcl/schemas'
import { getContract } from '../contract/selectors'
import { RootState } from '../reducer'
import { getFingerprint } from './estate/utils'
import { NFT } from './types'

export const useFingerprint = (nft: NFT | null) => {
  const [fingerprint, setFingerprint] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const estate = useSelector((state: RootState) =>
    getContract(state, { category: NFTCategory.ESTATE })
  )

  useEffect(() => {
    if (nft && estate) {
      switch (nft.category) {
        case NFTCategory.ESTATE: {
          setIsLoading(true)
          getFingerprint(nft.tokenId, estate)
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
  }, [estate, nft, setFingerprint, setIsLoading])

  return [fingerprint, isLoading] as const
}
