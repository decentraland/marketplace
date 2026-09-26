import { ChainId } from '@dcl/schemas'
import { Item } from '../modules/item/types'
import { NFT } from '../modules/nft/types'
import { isStolenNFT, isStolenToken } from './stolenNfts'
import stolenNftKeys from './stolenNfts.json'

const [chainId, contractAddress, tokenId] = stolenNftKeys.find(key => key.startsWith('1:'))!.split(':')

function makeNFT(overrides: Partial<NFT> = {}): NFT {
  return { chainId: Number(chainId), contractAddress, tokenId, ...overrides } as NFT
}

describe('isStolenNFT', () => {
  describe('when the NFT is in the stolen list', () => {
    it('should return true', () => {
      expect(isStolenNFT(makeNFT())).toBe(true)
    })
  })

  describe('when the contract address is in uppercase', () => {
    it('should return true', () => {
      expect(isStolenNFT(makeNFT({ contractAddress: contractAddress.toUpperCase().replace('0X', '0x') }))).toBe(true)
    })
  })

  describe('when the same token is on another chain', () => {
    it('should return false', () => {
      expect(isStolenNFT(makeNFT({ chainId: ChainId.MATIC_MAINNET }))).toBe(false)
    })
  })

  describe('when the token id is not in the stolen list', () => {
    it('should return false', () => {
      expect(isStolenNFT(makeNFT({ tokenId: '0' }))).toBe(false)
    })
  })

  describe('when the asset is an item', () => {
    it('should return false', () => {
      expect(isStolenNFT({ chainId: Number(chainId), contractAddress, itemId: tokenId } as unknown as Item)).toBe(false)
    })
  })

  describe('when the asset is null or undefined', () => {
    it('should return false', () => {
      expect(isStolenNFT(null)).toBe(false)
      expect(isStolenNFT(undefined)).toBe(false)
    })
  })
})

describe('isStolenToken', () => {
  describe('when the chain, contract and token id match a stolen NFT', () => {
    it('should return true', () => {
      expect(isStolenToken(chainId, contractAddress, tokenId)).toBe(true)
    })
  })

  describe('when the token is not in the stolen list', () => {
    it('should return false', () => {
      expect(isStolenToken(chainId, contractAddress, '0')).toBe(false)
    })
  })
})
