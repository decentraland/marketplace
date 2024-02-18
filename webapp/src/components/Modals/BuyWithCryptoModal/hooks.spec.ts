import { ChainId, Network } from '@dcl/schemas'
import { renderHook } from '@testing-library/react-hooks'
import type { Token } from 'decentraland-transactions/crossChain'
import type { Wallet } from 'decentraland-dapps/dist/modules/wallet'
import { useShouldUseCrossChainProvider, useNameMintingGasCost } from './hooks'

describe('when using the should use cross chain provider hook', () => {
  let selectedToken: Token

  describe('and the selected token is not mana', () => {
    beforeEach(() => {  
      selectedToken = { symbol: 'ETH', address: '0x1'} as Token
    })

    it('should return true', () => {
      const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, ChainId.MATIC_MAINNET, Network.ETHEREUM))
      expect(result.current).toBe(true)
    })
  })

  describe('and the selected token is mana', () => {
    let assetNetwork: Network

    beforeEach(() => {
      selectedToken = { symbol: 'MANA', address: '0x1'} as Token
    })

    describe('and the asset network is not ethereum and the network for the selected chain is ethereum', () => {
      beforeEach(() => {
        assetNetwork = Network.MATIC
      })

      it('should return true', () => {
        const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, ChainId.ETHEREUM_MAINNET, assetNetwork))
        expect(result.current).toBe(true)
      })
    })

    describe('and the asset network is matic and the network for the selected chain is not matic', () => {
      beforeEach(() => {
        assetNetwork = Network.MATIC
      })

      it('should return true', () => {
        const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, ChainId.ETHEREUM_MAINNET, assetNetwork))
        expect(result.current).toBe(true)
      })
    })

    describe('and the asset network is ethereum', () => {
      let selectedChain: ChainId
      
      beforeEach(() => {
        assetNetwork = Network.ETHEREUM
      })

      describe('and the network for the selected chain is not ethereum', () => {
        beforeEach(() => {
          selectedChain = ChainId.MATIC_MAINNET
        })

        it('should return true', () => {
          const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, selectedChain, assetNetwork))
          expect(result.current).toBe(true)
        })
      })

      describe('and the network for the selected chain is ethereum', () => {
        beforeEach(() => {
          selectedChain = ChainId.ETHEREUM_MAINNET
        })

        it('should return false', () => {
          const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, selectedChain, assetNetwork))
          expect(result.current).toBe(false)
        })
      })
    })

    describe('and the asset network is matic', () => {
      let selectedChain: ChainId
      
      beforeEach(() => {
        assetNetwork = Network.MATIC
      })

      describe('and the network for the selected chain is not matic', () => {
        beforeEach(() => {
          selectedChain = ChainId.ETHEREUM_MAINNET
        })

        it('should return true', () => {
          const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, selectedChain, assetNetwork))
          expect(result.current).toBe(true)
        })
      })

      describe('and the network for the selected chain is matic', () => {
        beforeEach(() => {
          selectedChain = ChainId.MATIC_MAINNET
        })

        it('should return false', () => {
          const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, selectedChain, assetNetwork))
          expect(result.current).toBe(false)
        })
      })
    })
  })
})

describe('when using the name minting as cost hook', () => {
  let selectedToken: Token
  let name: string
  let selectedChain: ChainId
  let wallet: Wallet | null
  let providerTokens: Token[]

  describe('and there\'s no wallet set', () => {
    beforeEach(() => {
      selectedToken = { symbol: 'MANA', address: '0x1'} as Token
      name = 'name'
      selectedChain = ChainId.ETHEREUM_MAINNET
      providerTokens = []
      wallet = null
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useNameMintingGasCost(name, selectedToken, selectedChain, wallet, providerTokens))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe('and the wallet\'s network is not the same as the asset\'s one', () => {
    beforeEach(() => {
      selectedToken = { symbol: 'MANA', address: '0x1'} as Token
      name = 'name'
      selectedChain = ChainId.ETHEREUM_MAINNET
      providerTokens = []
      wallet = {
        chainId: ChainId.MATIC_MAINNET,
        network: Network.MATIC
      } as Wallet
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useNameMintingGasCost(name, selectedToken, selectedChain, wallet, providerTokens))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe('and combination of selected tokens and chains results in the need of using a cross chain provider', () => {
    beforeEach(() => {
      selectedToken = { symbol: 'MANA', address: '0x1'} as Token
      name = 'name'
      selectedChain = ChainId.MATIC_MAINNET
      providerTokens = []
      wallet = {
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useNameMintingGasCost(name, selectedToken, selectedChain, wallet, providerTokens))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })
})