import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NFTCategory } from '@dcl/schemas'
import { getContract } from '../contract/selectors'
import { RootState } from '../reducer'
import { getTilesByEstateId } from '../tile/selectors'
import { generateFingerprint, getFingerprint } from './estate/utils'
import { NFT } from './types'

export const useFingerprint = (nft: NFT | null) => {
  const [fingerprint, setFingerprint] = useState<string>()
  const [contractFingerprint, setContractFingerprint] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingContract, setIsLoadingContract] = useState(false)
  const estate = useSelector((state: RootState) => getContract(state, { category: NFTCategory.ESTATE }))
  const landContract = useSelector((state: RootState) => getContract(state, { category: NFTCategory.PARCEL }))
  const tilesByEstateId = useSelector(getTilesByEstateId)

  useEffect(() => {
    if (nft && estate) {
      switch (nft.category) {
        case NFTCategory.ESTATE: {
          const parcels = (tilesByEstateId[nft.tokenId] || []).map(tile => ({
            x: tile.x,
            y: tile.y
          }))
          if (parcels.length) {
            setIsLoading(true)
            generateFingerprint(nft.tokenId, parcels, landContract!)
              .then(result => setFingerprint(result))
              .finally(() => setIsLoading(false))
              .catch(error => console.error(`Error generating fingerprint for nft ${nft.tokenId}`, error))
          }
          setIsLoadingContract(true)
          getFingerprint(nft.tokenId, estate)
            .then(result => setContractFingerprint(result))
            .finally(() => setIsLoadingContract(false))
            .catch(error => console.error(`Error getting fingerprint for nft ${nft.tokenId}`, error))
          break
        }
        default:
          break
      }
    }
  }, [estate, nft, landContract, tilesByEstateId, setFingerprint, setIsLoading, setIsLoadingContract, setContractFingerprint])

  return [fingerprint, isLoading || isLoadingContract, contractFingerprint] as const
}
