import { ChainId, Network, NFTCategory } from '@dcl/schemas'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { NFT } from '../nft/types'
import { VendorName } from '../vendor'
import { Contract } from '../vendor/services'
import {
  getContractKey,
  getContractKeyFromNFT,
  getAuthorizationKey,
  upsertContracts,
  getStubMaticCollectionContract,
  STUB_MATIC_COLLECTION_CONTRACT_NAME,
  isStubMaticCollectionContract,
  getContractByParams
} from './utils'

jest.mock('decentraland-dapps/dist/lib/eth')

describe('when calling upsertContracts', () => {
  let storedContracts: Contract[]
  let newContracts: Contract[]

  describe('when storedContracts is empty', () => {
    beforeEach(() => {
      storedContracts = []
    })

    describe('and newContracts is empty', () => {
      beforeEach(() => {
        newContracts = []
      })

      it('should return an empty array', () => {
        expect(upsertContracts(storedContracts, newContracts)).toEqual([])
      })
    })

    describe('and newContracts has a contract', () => {
      describe('and that contract has an upper cased address', () => {
        beforeEach(() => {
          newContracts = [{ address: 'ADDRESS', chainId: ChainId.MATIC_MUMBAI } as Contract]
        })

        it('should return an array with the new contract with its address lower cased', () => {
          const expectedContract = {
            ...newContracts[0],
            address: newContracts[0].address.toLowerCase()
          }

          expect(upsertContracts(storedContracts, newContracts)).toEqual([expectedContract])
        })
      })
    })
  })

  describe('when storedContracts has a contract', () => {
    beforeEach(() => {
      storedContracts = [
        {
          address: 'address',
          chainId: ChainId.MATIC_MUMBAI,
          name: 'name'
        } as Contract
      ]
    })

    describe('and newContracts is empty', () => {
      beforeEach(() => {
        newContracts = []
      })

      it('should return the storedContracts as is', () => {
        expect(upsertContracts(storedContracts, newContracts)).toEqual(storedContracts)
      })
    })

    describe('and newContracts has a contract with the same address (upper cased) and chain id', () => {
      beforeEach(() => {
        newContracts = [
          {
            address: 'ADDRESS',
            chainId: ChainId.MATIC_MUMBAI,
            name: 'name'
          } as Contract
        ]
      })

      it('should return the storedContracts as is', () => {
        expect(upsertContracts(storedContracts, newContracts)).toEqual(storedContracts)
      })
    })

    describe('and newContracts has a contract with different address but same chain id', () => {
      beforeEach(() => {
        newContracts = [
          {
            address: 'other address',
            chainId: ChainId.MATIC_MUMBAI,
            name: 'name'
          } as Contract
        ]
      })

      it('should return an array with the new contract added to the stored contracts', () => {
        expect(upsertContracts(storedContracts, newContracts)).toEqual([...storedContracts, ...newContracts])
      })
    })

    describe('and newContracts has a contract with same address but different chain id', () => {
      beforeEach(() => {
        newContracts = [
          {
            address: 'other address',
            chainId: ChainId.ETHEREUM_GOERLI,
            name: 'name'
          } as Contract
        ]
      })

      it('should return an array with the new contract added to the stored contracts', () => {
        expect(upsertContracts(storedContracts, newContracts)).toEqual([...storedContracts, ...newContracts])
      })
    })

    describe('and newContracts has a contract with the same address and chain id but different name', () => {
      beforeEach(() => {
        newContracts = [
          {
            address: 'ADDRESS',
            chainId: ChainId.MATIC_MUMBAI,
            name: 'different name'
          } as Contract
        ]
      })

      it('should update the stored contract with the new name', () => {
        expect(upsertContracts(storedContracts, newContracts)).toEqual([{ ...storedContracts[0], name: newContracts[0].name }])
      })
    })
  })
})

describe('when calling getContractKey', () => {
  it('should return a string with the contract address and chain id', () => {
    expect(
      getContractKey({
        address: 'address',
        chainId: ChainId.MATIC_MUMBAI
      } as Contract)
    ).toEqual('address-80001')
  })
})

describe('when calling getContractKeyFromNFT', () => {
  it('should return a string with the contract address and chain id', () => {
    expect(
      getContractKeyFromNFT({
        contractAddress: 'address',
        chainId: ChainId.MATIC_MUMBAI
      } as NFT)
    ).toEqual('address-80001')
  })
})

describe('when calling getAuthorizationKey', () => {
  it('should return a string that contains the address, the authorized address, the contract address and the chain Id', () => {
    expect(
      getAuthorizationKey({
        address: 'address',
        authorizedAddress: 'authorizedAddress',
        contractAddress: 'contractAddress',
        chainId: ChainId.MATIC_MUMBAI
      } as Authorization)
    ).toEqual('address-authorizedAddress-contractAddress-80001')
  })
})

describe('when calling getStubMaticCollectionContract', () => {
  it('should return stub matic collection contract with the address lowercased', () => {
    expect(getStubMaticCollectionContract('ADDRESS')).toEqual({
      address: 'address',
      category: NFTCategory.WEARABLE,
      chainId: undefined,
      name: STUB_MATIC_COLLECTION_CONTRACT_NAME,
      network: Network.MATIC,
      vendor: VendorName.DECENTRALAND
    })
  })
})

describe('when calling isStubMaticCollectionContract', () => {
  let contract: Contract

  describe('and the provided contract does not have the stub collection name', () => {
    beforeEach(() => {
      contract = {
        name: 'some other name',
        network: Network.MATIC
      } as Contract
    })

    it('should return false', () => {
      expect(isStubMaticCollectionContract(contract)).toBe(false)
    })
  })

  describe('and the provided contract does not have the Matic network', () => {
    beforeEach(() => {
      contract = {
        name: STUB_MATIC_COLLECTION_CONTRACT_NAME,
        network: Network.ETHEREUM
      } as Contract
    })

    it('should return false', () => {
      expect(isStubMaticCollectionContract(contract)).toBe(false)
    })
  })

  describe('and the provided contract has matic network and stub collection name', () => {
    beforeEach(() => {
      contract = {
        name: STUB_MATIC_COLLECTION_CONTRACT_NAME,
        network: Network.MATIC
      } as Contract
    })

    it('should return true', () => {
      expect(isStubMaticCollectionContract(contract)).toBe(true)
    })
  })
})

describe('when calling getContractByParams', () => {
  let contracts: Contract[]
  beforeEach(() => {
    contracts = [
      {
        label: 'contract1',
        category: NFTCategory.EMOTE,
        name: 'name1',
        address: 'address1',
        network: Network.ETHEREUM,
        chainId: ChainId.ETHEREUM_GOERLI,
        vendor: VendorName.DECENTRALAND
      },
      {
        label: 'contract2',
        category: NFTCategory.EMOTE,
        name: 'name2',
        address: 'address2',
        network: Network.ETHEREUM,
        chainId: ChainId.ETHEREUM_GOERLI,
        vendor: VendorName.DECENTRALAND
      },
      {
        label: 'contract3',
        category: NFTCategory.EMOTE,
        name: 'name3',
        address: 'address3',
        network: Network.ETHEREUM,
        chainId: ChainId.ETHEREUM_GOERLI,
        vendor: VendorName.DECENTRALAND
      }
    ]
  })

  describe('when sending one property in query', () => {
    it('should return the contract that matches the property', () => {
      expect(getContractByParams(contracts, { label: 'contract1' })).toEqual(contracts[0])
    })
  })

  describe('when sending multiple properties', () => {
    it('should return the contract that matches all properties', () => {
      expect(
        getContractByParams(contracts, {
          label: 'contract1',
          category: NFTCategory.EMOTE
        })
      ).toEqual(contracts[0])
    })

    it('should return null if no contract matches', () => {
      expect(
        getContractByParams(contracts, {
          label: 'contract1',
          category: NFTCategory.ENS
        })
      ).toEqual(null)
    })
  })
})
