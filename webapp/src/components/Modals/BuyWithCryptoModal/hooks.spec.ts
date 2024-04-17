import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import ethersModule, { BigNumber, ethers } from 'ethers'
import { ChainId, Network, Order, Item } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet'
import { NATIVE_TOKEN, Token } from 'decentraland-transactions/crossChain'
import { NFT } from '../../../modules/nft/types'
import { useShouldUseCrossChainProvider, useNameMintingGasCost, useTokenBalance, useBuyNftGasCost, useMintingNftGasCost } from './hooks'
import { estimateBuyNftGas, estimateMintNftGas, estimateNameMintingGas } from './utils'

jest.mock(
  'ethers',
  () =>
    ({
      ...jest.requireActual('ethers'),
      ethers: {
        ...jest.requireActual<typeof ethersModule>('ethers').ethers,
        Contract: function (address: string, abi: string[], provider: any) {
          return {
            address,
            abi,
            provider,
            balanceOf: () => Promise.resolve(BigNumber.from(3232))
          }
        },
        providers: {
          Web3Provider: function () {
            return {
              getGasPrice: () => Promise.resolve(BigNumber.from(4)),
              send: (method: string) => (method === 'eth_getBalance' ? Promise.resolve(BigNumber.from(3231)) : Promise.resolve(undefined))
            }
          }
        }
      }
    }) as unknown
)

jest.mock('./utils', () => {
  return {
    ...jest.requireActual('./utils'),
    estimateNameMintingGas: jest.fn(),
    estimateMintNftGas: jest.fn(),
    estimateBuyNftGas: jest.fn()
  } as unknown
})

jest.mock('decentraland-dapps/dist/lib', () => {
  return {
    ...jest.requireActual('./utils'),
    getNetworkProvider: () =>
      Promise.resolve({
        name: 'aProvider'
      })
  } as unknown
})

describe('when using the should use cross chain provider hook', () => {
  let selectedToken: Token

  describe('and the selected token is not mana', () => {
    beforeEach(() => {
      selectedToken = { symbol: 'ETH', chainId: '1', address: '0x1' } as Token
    })

    it('should return true', () => {
      const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, Network.ETHEREUM))
      expect(result.current).toBe(true)
    })
  })

  describe('and the selected token is mana', () => {
    let assetNetwork: Network

    beforeEach(() => {
      selectedToken = { symbol: 'MANA', chainId: '1', address: '0x1' } as Token
    })

    describe('and the asset network is not ethereum and the network for the selected chain is ethereum', () => {
      beforeEach(() => {
        assetNetwork = Network.MATIC
      })

      it('should return true', () => {
        const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, assetNetwork))
        expect(result.current).toBe(true)
      })
    })

    describe('and the asset network is matic and the network for the selected chain is not matic', () => {
      beforeEach(() => {
        assetNetwork = Network.MATIC
      })

      it('should return true', () => {
        const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, assetNetwork))
        expect(result.current).toBe(true)
      })
    })

    describe('and the asset network is ethereum', () => {
      beforeEach(() => {
        assetNetwork = Network.ETHEREUM
      })

      describe('and the network for the selected chain is not ethereum', () => {
        beforeEach(() => {
          selectedToken = {
            ...selectedToken,
            chainId: ChainId.MATIC_MAINNET.toString()
          }
        })

        it('should return true', () => {
          const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, assetNetwork))
          expect(result.current).toBe(true)
        })
      })

      describe('and the network for the selected chain is ethereum', () => {
        beforeEach(() => {
          selectedToken = {
            ...selectedToken,
            chainId: ChainId.ETHEREUM_MAINNET.toString()
          }
        })

        it('should return false', () => {
          const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, assetNetwork))
          expect(result.current).toBe(false)
        })
      })
    })

    describe('and the asset network is matic', () => {
      beforeEach(() => {
        assetNetwork = Network.MATIC
      })

      describe('and the network for the selected chain is not matic', () => {
        beforeEach(() => {
          selectedToken = {
            ...selectedToken,
            chainId: ChainId.ETHEREUM_MAINNET.toString()
          }
        })

        it('should return true', () => {
          const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, assetNetwork))
          expect(result.current).toBe(true)
        })
      })

      describe('and the network for the selected chain is matic', () => {
        beforeEach(() => {
          selectedToken = {
            ...selectedToken,
            chainId: ChainId.MATIC_MAINNET.toString()
          }
        })

        it('should return false', () => {
          const { result } = renderHook(() => useShouldUseCrossChainProvider(selectedToken, assetNetwork))
          expect(result.current).toBe(false)
        })
      })
    })
  })
})

describe('when using the name minting gas cost hook', () => {
  let selectedToken: Token
  let name: string
  let wallet: Wallet | null
  let chainNativeToken: Token

  beforeEach(() => {
    name = 'name'
    chainNativeToken = {
      symbol: 'ETH',
      address: '0x1',
      chainId: ChainId.ETHEREUM_MAINNET.toString(),
      usdPrice: 10
    } as Token
  })

  describe("and there's no wallet set", () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token
      wallet = null
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useNameMintingGasCost(name, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe("and the wallet's network is not the same as the asset's one", () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token
      wallet = {
        chainId: ChainId.MATIC_MAINNET,
        network: Network.MATIC
      } as Wallet
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useNameMintingGasCost(name, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe('and combination of selected tokens and chains results in the need of using a cross chain provider', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.MATIC_MAINNET.toString()
      } as Token
      wallet = {
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useNameMintingGasCost(name, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe('and all parameters are set to get the gas', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: NATIVE_TOKEN,
        chainId: ChainId.ETHEREUM_MAINNET.toString(),
        usdPrice: 10
      } as Token
      wallet = {
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    describe('and the transactions gas estimation fails', () => {
      beforeEach(() => {
        ;(
          estimateNameMintingGas as jest.Mock<ReturnType<typeof estimateNameMintingGas>, Parameters<typeof estimateNameMintingGas>>
        ).mockRejectedValueOnce(undefined)
      })

      it('should return an undefined cost and the loading flag as false', async () => {
        const { result } = renderHook(() => useNameMintingGasCost(name, selectedToken, chainNativeToken, wallet))
        await waitFor(() => {
          expect(result.current.isFetchingGasCost).toBe(false)
        })
        expect(result.current.gasCost).toBe(undefined)
      })
    })

    describe('and the transactions gas estimation is successful', () => {
      beforeEach(() => {
        ;(
          estimateNameMintingGas as jest.Mock<ReturnType<typeof estimateNameMintingGas>, Parameters<typeof estimateNameMintingGas>>
        ).mockResolvedValueOnce(BigNumber.from('4000000000000000000'))
      })

      it('should return a total gas cost of 16, a USD gas cost of 160, the native token and the loading flag as false', async () => {
        const { result } = renderHook(() => useNameMintingGasCost(name, selectedToken, chainNativeToken, wallet))

        await waitFor(() => {
          expect(result.current.isFetchingGasCost).toBe(false)
        })
        expect(result.current.gasCost?.total).toEqual(ethers.utils.formatEther(BigNumber.from('16000000000000000000')))
        expect(result.current.gasCost?.token).toEqual(chainNativeToken)
        expect(result.current.gasCost?.totalUSDPrice).toEqual(160)
      })
    })
  })
})

describe('when using the buy nft gas cost hook', () => {
  let selectedToken: Token
  let nft: NFT
  let order: Order
  let wallet: Wallet | null
  let chainNativeToken: Token

  beforeEach(() => {
    nft = {
      id: 'aNftId',
      data: {}
    } as NFT
    order = {
      id: 'anOrderId',
      price: '1000000000000000000',
      chainId: ChainId.ETHEREUM_MAINNET,
      network: Network.ETHEREUM
    } as Order
    chainNativeToken = {
      symbol: 'ETH',
      address: '0x1',
      chainId: ChainId.ETHEREUM_MAINNET.toString(),
      usdPrice: 10
    } as Token
  })

  describe("and there's no wallet set", () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token

      wallet = null
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useBuyNftGasCost(nft, order, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe("and the wallet's network is not the same as the asset's one", () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token
      wallet = {
        chainId: ChainId.MATIC_MAINNET,
        network: Network.MATIC
      } as Wallet
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useBuyNftGasCost(nft, order, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe('and combination of selected tokens and chains results in the need of using a cross chain provider', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.MATIC_MAINNET.toString()
      } as Token
      wallet = {
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useBuyNftGasCost(nft, order, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe('and all parameters are set to get the gas', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: NATIVE_TOKEN,
        chainId: ChainId.ETHEREUM_MAINNET.toString(),
        usdPrice: 10
      } as Token
      wallet = {
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    describe('and the transactions gas estimation fails', () => {
      beforeEach(() => {
        ;(estimateBuyNftGas as jest.Mock<ReturnType<typeof estimateBuyNftGas>, Parameters<typeof estimateBuyNftGas>>).mockRejectedValueOnce(
          undefined
        )
      })

      it('should return an undefined cost and the loading flag as false', async () => {
        const { result } = renderHook(() => useBuyNftGasCost(nft, order, selectedToken, chainNativeToken, wallet))
        await waitFor(() => {
          expect(result.current.isFetchingGasCost).toBe(false)
        })
        expect(result.current.gasCost).toBe(undefined)
      })
    })

    describe('and the transactions gas estimation is successful', () => {
      beforeEach(() => {
        ;(estimateBuyNftGas as jest.Mock<ReturnType<typeof estimateBuyNftGas>, Parameters<typeof estimateBuyNftGas>>).mockResolvedValueOnce(
          BigNumber.from('4000000000000000000')
        )
      })

      it('should return a total gas cost of 16, a USD gas cost of 160, the native token and the loading flag as false', async () => {
        const { result } = renderHook(() => useBuyNftGasCost(nft, order, selectedToken, chainNativeToken, wallet))

        await waitFor(() => {
          expect(result.current.isFetchingGasCost).toBe(false)
        })
        expect(result.current.gasCost?.total).toEqual(ethers.utils.formatEther(BigNumber.from('16000000000000000000')))
        expect(result.current.gasCost?.token).toEqual(chainNativeToken)
        expect(result.current.gasCost?.totalUSDPrice).toEqual(160)
      })
    })
  })
})

describe('when using the minting nft gas cost hook', () => {
  let selectedToken: Token
  let item: Item
  let wallet: Wallet | null
  let chainNativeToken: Token

  beforeEach(() => {
    item = {
      id: 'aNftId',
      price: '1000000000000000000',
      chainId: ChainId.ETHEREUM_MAINNET,
      network: Network.ETHEREUM
    } as Item
    chainNativeToken = {
      symbol: 'ETH',
      address: '0x1',
      chainId: ChainId.ETHEREUM_MAINNET.toString(),
      usdPrice: 10
    } as Token
  })

  describe("and there's no wallet set", () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token

      wallet = null
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useMintingNftGasCost(item, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe("and the wallet's network is not the same as the asset's one", () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token
      wallet = {
        chainId: ChainId.MATIC_MAINNET,
        network: Network.MATIC
      } as Wallet
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useMintingNftGasCost(item, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe('and combination of selected tokens and chains results in the need of using a cross chain provider', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x1',
        chainId: ChainId.MATIC_MAINNET.toString()
      } as Token
      wallet = {
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    it('should return an undefined cost and the loading flag as false', () => {
      const { result } = renderHook(() => useMintingNftGasCost(item, selectedToken, chainNativeToken, wallet))
      expect(result.current.gasCost).toBe(undefined)
      expect(result.current.isFetchingGasCost).toBe(false)
    })
  })

  describe('and all parameters are set to get the gas', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: NATIVE_TOKEN,
        chainId: ChainId.ETHEREUM_MAINNET.toString(),
        usdPrice: 10
      } as Token
      wallet = {
        address: '0x1',
        chainId: ChainId.ETHEREUM_MAINNET,
        network: Network.ETHEREUM
      } as Wallet
    })

    describe('and the transactions gas estimation fails', () => {
      beforeEach(() => {
        ;(
          estimateMintNftGas as jest.Mock<ReturnType<typeof estimateMintNftGas>, Parameters<typeof estimateMintNftGas>>
        ).mockRejectedValueOnce(undefined)
      })

      it('should return an undefined cost and the loading flag as false', async () => {
        const { result } = renderHook(() => useMintingNftGasCost(item, selectedToken, chainNativeToken, wallet))
        await waitFor(() => {
          expect(result.current.isFetchingGasCost).toBe(false)
        })
        expect(result.current.gasCost).toBe(undefined)
      })
    })

    describe('and the transactions gas estimation is successful', () => {
      beforeEach(() => {
        ;(
          estimateMintNftGas as jest.Mock<ReturnType<typeof estimateMintNftGas>, Parameters<typeof estimateMintNftGas>>
        ).mockResolvedValueOnce(BigNumber.from('4000000000000000000'))
      })

      it('should return a total gas cost of 16, a USD gas cost of 160, the native token and the loading flag as false', async () => {
        const { result } = renderHook(() => useMintingNftGasCost(item, selectedToken, chainNativeToken, wallet))

        await waitFor(() => {
          expect(result.current.isFetchingGasCost).toBe(false)
        })
        expect(result.current.gasCost?.total).toEqual(ethers.utils.formatEther(BigNumber.from('16000000000000000000')))
        expect(result.current.gasCost?.token).toEqual(chainNativeToken)
        expect(result.current.gasCost?.totalUSDPrice).toEqual(160)
      })
    })
  })
})

describe('when using the use token balance hook', () => {
  let address: string | undefined
  let selectedToken: Token
  let selectedChainId: ChainId

  describe('and the address is not set', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'ETH',
        address: NATIVE_TOKEN,
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token
      address = undefined
    })

    it('should return an undefined token balance and the loading flag as false', async () => {
      const { result } = renderHook(() => useTokenBalance(selectedToken, selectedChainId, address))
      await waitFor(() => {
        expect(result.current.isFetchingBalance).toBe(false)
      })
      expect(result.current.tokenBalance).toBe(undefined)
    })
  })

  describe('and the selected currency is MANA', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'MANA',
        address: '0x3',
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token
      address = '0x1'
      selectedChainId = ChainId.ETHEREUM_MAINNET
    })

    it('should return an undefined balance and the loading flag as false', async () => {
      const { result } = renderHook(() => useTokenBalance(selectedToken, selectedChainId, address))
      await waitFor(() => {
        expect(result.current.isFetchingBalance).toBe(false)
      })
      expect(result.current.tokenBalance).toBe(undefined)
    })
  })

  describe('and the selected token is the native one', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'ETH',
        address: NATIVE_TOKEN,
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token
      address = '0x1'
      selectedChainId = ChainId.ETHEREUM_MAINNET
    })

    it('should return the balance of the native token and the loading flag as false', async () => {
      const { result } = renderHook(() => useTokenBalance(selectedToken, selectedChainId, address))

      await waitFor(() => {
        expect(result.current.isFetchingBalance).toBe(false)
      })
      expect(result.current.tokenBalance).toEqual(BigNumber.from(3231))
    })
  })

  describe('and the selected token is not the native one and is not MANA', () => {
    beforeEach(() => {
      selectedToken = {
        symbol: 'USDC',
        address: '0x2',
        chainId: ChainId.ETHEREUM_MAINNET.toString()
      } as Token
      address = '0x1'
      selectedChainId = ChainId.ETHEREUM_MAINNET
    })

    it('should return the balance of the selected token and the loading flag as false', async () => {
      const { result } = renderHook(() => useTokenBalance(selectedToken, selectedChainId, address))

      await waitFor(() => {
        expect(result.current.isFetchingBalance).toBe(false)
      })
      expect(result.current.tokenBalance).toEqual(BigNumber.from(3232))
    })
  })
})
