import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib'
import ERC721ABI from '../../contracts/ERC721.json'

const fetchContractName = async (address: string, chainId: ChainId) => {
  try {
    if (!address || !chainId) {
      return null
    }

    const provider = await getNetworkProvider(chainId)

    const erc721 = new ethers.Contract(address, ERC721ABI, new ethers.providers.Web3Provider(provider))

    return (await erc721.name()) as string
  } catch (e) {
    return null
  }
}

export function useERC721ContractName(address: string, chainId: ChainId) {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    fetchContractName(address, chainId)
      .then(() => {
        if (!cancel) {
          setName(name)
        }
      })
      .catch(() => console.error('Could not fetch contract name'))
    return () => {
      cancel = true
    }
  }, [address, chainId])

  return name
}
