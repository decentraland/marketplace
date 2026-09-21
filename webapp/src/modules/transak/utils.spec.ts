import { ChainId, Network } from '@dcl/schemas'
import { ContractName, getContract } from 'decentraland-transactions'
import { getTransakContractId, isTransakSupported } from './utils'

const MARKETPLACE_V2_POLYGON = getContract(ContractName.OffChainMarketplaceV2, ChainId.MATIC_MAINNET).address
const MARKETPLACE_V3_POLYGON = getContract(ContractName.OffChainMarketplaceV3, ChainId.MATIC_MAINNET).address
const MARKETPLACE_V3_AMOY = getContract(ContractName.OffChainMarketplaceV3, ChainId.MATIC_AMOY).address

describe('when resolving the Transak contract id of a purchase', () => {
  let contractId: string | undefined

  describe('and it is a trade signed against a registered marketplace version', () => {
    beforeEach(() => {
      contractId = getTransakContractId({
        kind: 'trade',
        network: Network.MATIC,
        chainId: ChainId.MATIC_MAINNET,
        marketplaceAddress: MARKETPLACE_V2_POLYGON
      })
    })

    it('should return the off-chain marketplace registration, which is not the legacy one', () => {
      expect(contractId).toBe('6717e6cd2fb1688e111c1a80')
    })
  })

  describe('and it is a trade signed against a version Transak has never been told about', () => {
    beforeEach(() => {
      contractId = getTransakContractId({
        kind: 'trade',
        network: Network.MATIC,
        chainId: ChainId.MATIC_MAINNET,
        marketplaceAddress: MARKETPLACE_V3_POLYGON
      })
    })

    it('should return nothing rather than another version’s registration', () => {
      expect(contractId).toBeUndefined()
    })
  })

  describe('and the trade names an address the contract registry does not know', () => {
    beforeEach(() => {
      contractId = getTransakContractId({
        kind: 'trade',
        network: Network.MATIC,
        chainId: ChainId.MATIC_MAINNET,
        marketplaceAddress: '0x0000000000000000000000000000000000000001'
      })
    })

    it('should return nothing instead of throwing out of the lookup', () => {
      expect(contractId).toBeUndefined()
    })
  })

  describe('and the listing is a legacy on-chain order', () => {
    beforeEach(() => {
      contractId = getTransakContractId({ kind: 'order', network: Network.MATIC, chainId: ChainId.MATIC_MAINNET })
    })

    it('should return the legacy marketplace registration', () => {
      expect(contractId).toBe('6717e6dac00223b9cc8e51cd')
    })
  })

  describe('and the listing is a collection store mint', () => {
    beforeEach(() => {
      contractId = getTransakContractId({ kind: 'mint', network: Network.MATIC, chainId: ChainId.MATIC_MAINNET })
    })

    it('should return the store registration', () => {
      expect(contractId).toBe('6717e6e62fb1688e111c1a87')
    })
  })

  describe('and the buyer is paying with credits', () => {
    describe('and the chain has a credits manager registration', () => {
      beforeEach(() => {
        contractId = getTransakContractId({
          kind: 'trade',
          network: Network.MATIC,
          chainId: ChainId.MATIC_AMOY,
          marketplaceAddress: MARKETPLACE_V3_AMOY,
          useCredits: true
        })
      })

      it('should return it even for a marketplace version Transak does not know, since that route does not touch it', () => {
        expect(contractId).toBe('67dd4ceda7e28cc91ce4c391')
      })
    })

    describe('and the chain has no credits manager registration', () => {
      beforeEach(() => {
        contractId = getTransakContractId({
          kind: 'trade',
          network: Network.MATIC,
          chainId: ChainId.MATIC_MAINNET,
          marketplaceAddress: MARKETPLACE_V2_POLYGON,
          useCredits: true
        })
      })

      it('should return nothing, because the placeholder entry is not a registration', () => {
        expect(contractId).toBeUndefined()
      })
    })
  })

  describe('and the purchase is on a network Transak is not registered on', () => {
    beforeEach(() => {
      contractId = getTransakContractId({ kind: 'order', network: Network.AVALANCHE, chainId: ChainId.MATIC_MAINNET })
    })

    it('should return nothing', () => {
      expect(contractId).toBeUndefined()
    })
  })
})

describe('when deciding whether to offer the card rail', () => {
  let supported: boolean

  describe('and the listing settles on a marketplace version Transak knows', () => {
    beforeEach(() => {
      supported = isTransakSupported({
        kind: 'trade',
        network: Network.MATIC,
        chainId: ChainId.MATIC_MAINNET,
        marketplaceAddress: MARKETPLACE_V2_POLYGON
      })
    })

    it('should offer it', () => {
      expect(supported).toBe(true)
    })
  })

  describe('and the listing settles on a version Transak does not know', () => {
    beforeEach(() => {
      supported = isTransakSupported({
        kind: 'trade',
        network: Network.MATIC,
        chainId: ChainId.MATIC_MAINNET,
        marketplaceAddress: MARKETPLACE_V3_POLYGON
      })
    })

    it('should not offer it, so the buyer never reaches a widget that cannot execute', () => {
      expect(supported).toBe(false)
    })
  })

  describe('and the buyer has selected credits', () => {
    describe('and the listing settles on a version Transak knows', () => {
      beforeEach(() => {
        supported = isTransakSupported({
          kind: 'trade',
          network: Network.MATIC,
          chainId: ChainId.MATIC_MAINNET,
          marketplaceAddress: MARKETPLACE_V2_POLYGON,
          useCredits: true
        })
      })

      it('should not offer it, since credits and the card are not a supported pair', () => {
        expect(supported).toBe(false)
      })
    })

    describe('and the chain registers a credits manager of its own', () => {
      beforeEach(() => {
        supported = isTransakSupported({
          kind: 'trade',
          network: Network.MATIC,
          chainId: ChainId.MATIC_AMOY,
          marketplaceAddress: MARKETPLACE_V3_AMOY,
          useCredits: true
        })
      })

      it('should still not offer it, so the registration alone cannot bring the pair back', () => {
        expect(supported).toBe(false)
      })
    })
  })

  describe('and the buyer has not selected credits', () => {
    describe('and only the credits route is registered on the chain', () => {
      beforeEach(() => {
        supported = isTransakSupported({
          kind: 'trade',
          network: Network.MATIC,
          chainId: ChainId.MATIC_AMOY,
          marketplaceAddress: MARKETPLACE_V3_AMOY,
          useCredits: false
        })
      })

      it('should not offer it, because the click would take the unregistered direct route', () => {
        expect(supported).toBe(false)
      })
    })
  })
})
