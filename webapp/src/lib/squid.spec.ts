import { pollSquidRouteStatus, SquidTransactionStatus, SquidStatusResponse, PollSquidRouteStatusParams } from './squid'

describe('Squid Polling Utility', () => {
  let mockFetch: jest.Mock
  let originalFetch: typeof global.fetch

  beforeEach(() => {
    originalFetch = global.fetch
    mockFetch = jest.fn()
    global.fetch = mockFetch
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    global.fetch = originalFetch
    jest.useRealTimers()
  })

  describe('when polling a successful transaction', () => {
    let mockSuccessResponse: SquidStatusResponse
    let fetchResponse: { ok: boolean; json: () => Promise<SquidStatusResponse> }
    let pollParams: PollSquidRouteStatusParams

    beforeEach(() => {
      mockSuccessResponse = {
        id: '0xTransactionHash',
        status: 'success',
        gasStatus: '',
        isGMPTransaction: false,
        squidTransactionStatus: SquidTransactionStatus.SUCCESS,
        axelarTransactionUrl: '',
        fromChain: {
          transactionId: '0xFromTxHash',
          blockNumber: '12345',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://polygonscan.com/tx/0xFromTxHash'
        },
        toChain: {
          transactionId: '0xToTxHash',
          blockNumber: '67890',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://etherscan.io/tx/0xToTxHash'
        },
        timeSpent: {
          total: 120
        },
        routeStatus: [
          {
            chainId: '137',
            txHash: '0xFromTxHash',
            status: 'success',
            action: 'send'
          },
          {
            chainId: '1',
            txHash: '0xToTxHash',
            status: 'success',
            action: 'call'
          }
        ]
      }

      fetchResponse = {
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      }

      pollParams = {
        transactionId: '0xTransactionHash',
        fromChainId: '137',
        toChainId: '1',
        quoteId: 'test-quote-id',
        integratorId: 'test-integrator',
        apiUrl: 'https://api.test.com'
      }

      mockFetch.mockResolvedValueOnce(fetchResponse)
    })

    it('should return the status response when transaction is successful', async () => {
      const promise = pollSquidRouteStatus(pollParams)

      // Advance timers to trigger the first poll
      await jest.advanceTimersByTimeAsync(0)
      const result = await promise

      expect(result).toEqual(mockSuccessResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/v2/status?transactionId=0xTransactionHash&fromChainId=137&toChainId=1&quoteId=test-quote-id',
        {
          method: 'GET',
          headers: {
            'x-integrator-id': 'test-integrator',
            'Content-Type': 'application/json'
          }
        }
      )
    })
  })

  describe('when transaction is ongoing', () => {
    let mockOngoingResponse: SquidStatusResponse
    let mockSuccessResponse: SquidStatusResponse
    let pollParams: PollSquidRouteStatusParams

    beforeEach(() => {
      mockOngoingResponse = {
        id: '0xTransactionHash',
        status: 'pending',
        gasStatus: '',
        isGMPTransaction: false,
        squidTransactionStatus: SquidTransactionStatus.ONGOING,
        axelarTransactionUrl: '',
        fromChain: {
          transactionId: '0xFromTxHash',
          blockNumber: '12345',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://polygonscan.com/tx/0xFromTxHash'
        },
        toChain: {
          transactionId: '',
          blockNumber: '',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: ''
        },
        timeSpent: {
          total: 30
        },
        routeStatus: []
      }

      mockSuccessResponse = {
        ...mockOngoingResponse,
        squidTransactionStatus: SquidTransactionStatus.SUCCESS,
        toChain: {
          transactionId: '0xToTxHash',
          blockNumber: '67890',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://etherscan.io/tx/0xToTxHash'
        }
      }

      pollParams = {
        transactionId: '0xTransactionHash',
        fromChainId: '137',
        toChainId: '1',
        quoteId: 'test-quote-id',
        integratorId: 'test-integrator',
        apiUrl: 'https://api.test.com'
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockOngoingResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockOngoingResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSuccessResponse)
        })
    })

    it('should poll until transaction succeeds', async () => {
      const promise = pollSquidRouteStatus(pollParams)

      // Advance timers through the polling cycle
      for (let i = 0; i < 3; i++) {
        await jest.advanceTimersByTimeAsync(5000)
      }

      const result = await promise

      expect(result).toEqual(mockSuccessResponse)
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('when transaction needs gas', () => {
    let mockNeedsGasResponse: SquidStatusResponse
    let pollParams: PollSquidRouteStatusParams
    let fetchResponse: { ok: boolean; json: () => Promise<SquidStatusResponse> }

    beforeEach(() => {
      mockNeedsGasResponse = {
        id: '0xTransactionHash',
        status: 'needs_gas',
        gasStatus: 'GAS_REQUIRED',
        isGMPTransaction: false,
        squidTransactionStatus: SquidTransactionStatus.NEEDS_GAS,
        axelarTransactionUrl: '',
        fromChain: {
          transactionId: '0xFromTxHash',
          blockNumber: '12345',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://polygonscan.com/tx/0xFromTxHash'
        },
        toChain: {
          transactionId: '',
          blockNumber: '',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: ''
        },
        timeSpent: {
          total: 30
        },
        routeStatus: []
      }

      fetchResponse = {
        ok: true,
        json: () => Promise.resolve(mockNeedsGasResponse)
      }

      pollParams = {
        transactionId: '0xTransactionHash',
        fromChainId: '137',
        toChainId: '1',
        quoteId: 'test-quote-id',
        integratorId: 'test-integrator',
        apiUrl: 'https://api.test.com'
      }

      mockFetch.mockResolvedValueOnce(fetchResponse)
    })

    it('should throw an error with needs gas message', async () => {
      const promise = pollSquidRouteStatus(pollParams).catch((e: Error) => e)

      // Run all pending timers and promises
      await jest.runAllTimersAsync()
      const result = await promise

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe('Transaction needs additional gas on destination chain. Please check Axelarscan for details.')
    })
  })

  describe('when transaction has partial success', () => {
    let mockPartialSuccessResponse: SquidStatusResponse
    let pollParams: PollSquidRouteStatusParams
    let fetchResponse: { ok: boolean; json: () => Promise<SquidStatusResponse> }

    beforeEach(() => {
      mockPartialSuccessResponse = {
        id: '0xTransactionHash',
        status: 'partial_success',
        gasStatus: '',
        isGMPTransaction: false,
        squidTransactionStatus: SquidTransactionStatus.PARTIAL_SUCCESS,
        axelarTransactionUrl: '',
        fromChain: {
          transactionId: '0xFromTxHash',
          blockNumber: '12345',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://polygonscan.com/tx/0xFromTxHash'
        },
        toChain: {
          transactionId: '',
          blockNumber: '',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: ''
        },
        timeSpent: {
          total: 60
        },
        routeStatus: []
      }

      fetchResponse = {
        ok: true,
        json: () => Promise.resolve(mockPartialSuccessResponse)
      }

      pollParams = {
        transactionId: '0xTransactionHash',
        fromChainId: '137',
        toChainId: '1',
        quoteId: 'test-quote-id',
        integratorId: 'test-integrator',
        apiUrl: 'https://api.test.com'
      }

      mockFetch.mockResolvedValueOnce(fetchResponse)
    })

    it('should throw an error with partial success message', async () => {
      const promise = pollSquidRouteStatus(pollParams).catch((e: Error) => e)

      // Run all pending timers and promises
      await jest.runAllTimersAsync()
      const result = await promise

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe(
        'Transaction partially completed. You may have received bridged tokens. Please check the Activity page.'
      )
    })
  })

  describe('when transaction is refunded', () => {
    let mockRefundResponse: SquidStatusResponse
    let pollParams: PollSquidRouteStatusParams
    let fetchResponse: { ok: boolean; json: () => Promise<SquidStatusResponse> }

    beforeEach(() => {
      mockRefundResponse = {
        id: '0xTransactionHash',
        status: 'refunded',
        gasStatus: '',
        isGMPTransaction: false,
        squidTransactionStatus: SquidTransactionStatus.REFUND_STATUS,
        axelarTransactionUrl: '',
        fromChain: {
          transactionId: '0xFromTxHash',
          blockNumber: '12345',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://polygonscan.com/tx/0xFromTxHash'
        },
        toChain: {
          transactionId: '',
          blockNumber: '',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: ''
        },
        timeSpent: {
          total: 90
        },
        routeStatus: []
      }

      fetchResponse = {
        ok: true,
        json: () => Promise.resolve(mockRefundResponse)
      }

      pollParams = {
        transactionId: '0xTransactionHash',
        fromChainId: '137',
        toChainId: '1',
        quoteId: 'test-quote-id',
        integratorId: 'test-integrator',
        apiUrl: 'https://api.test.com'
      }

      mockFetch.mockResolvedValueOnce(fetchResponse)
    })

    it('should throw an error with refund message', async () => {
      const promise = pollSquidRouteStatus(pollParams).catch((e: Error) => e)

      // Run all pending timers and promises
      await jest.runAllTimersAsync()
      const result = await promise

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe('Transaction failed and funds were refunded to your wallet.')
    })
  })

  describe('when transaction is not found', () => {
    describe('and less than 1 minute has elapsed', () => {
      let mockNotFoundResponse: SquidStatusResponse
      let mockSuccessResponse: SquidStatusResponse
      let pollParams: PollSquidRouteStatusParams

      beforeEach(() => {
        mockNotFoundResponse = {
          id: '0xTransactionHash',
          status: 'not_found',
          gasStatus: '',
          isGMPTransaction: false,
          squidTransactionStatus: SquidTransactionStatus.NOT_FOUND,
          axelarTransactionUrl: '',
          fromChain: {
            transactionId: '',
            blockNumber: '',
            callEventStatus: '',
            callEventLog: [],
            chainData: {},
            transactionUrl: ''
          },
          toChain: {
            transactionId: '',
            blockNumber: '',
            callEventStatus: '',
            callEventLog: [],
            chainData: {},
            transactionUrl: ''
          },
          timeSpent: {
            total: 30
          },
          routeStatus: []
        }

        mockSuccessResponse = {
          ...mockNotFoundResponse,
          status: 'success',
          squidTransactionStatus: SquidTransactionStatus.SUCCESS,
          toChain: {
            transactionId: '0xToTxHash',
            blockNumber: '67890',
            callEventStatus: '',
            callEventLog: [],
            chainData: {},
            transactionUrl: 'https://etherscan.io/tx/0xToTxHash'
          }
        }

        pollParams = {
          transactionId: '0xTransactionHash',
          fromChainId: '137',
          toChainId: '1',
          quoteId: 'test-quote-id',
          integratorId: 'test-integrator',
          apiUrl: 'https://api.test.com'
        }

        mockFetch
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockNotFoundResponse)
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockNotFoundResponse)
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockSuccessResponse)
          })
      })

      it('should continue polling', async () => {
        const promise = pollSquidRouteStatus(pollParams)

        // Advance through polling cycles (less than 1 minute total)
        for (let i = 0; i < 3; i++) {
          await jest.advanceTimersByTimeAsync(5000)
        }

        const result = await promise

        expect(result).toEqual(mockSuccessResponse)
        expect(mockFetch).toHaveBeenCalledTimes(3)
      })
    })

    describe('and more than 1 minute has elapsed', () => {
      let mockNotFoundResponse: SquidStatusResponse
      let pollParams: PollSquidRouteStatusParams

      beforeEach(() => {
        mockNotFoundResponse = {
          id: '0xTransactionHash',
          status: 'not_found',
          gasStatus: '',
          isGMPTransaction: false,
          squidTransactionStatus: SquidTransactionStatus.NOT_FOUND,
          axelarTransactionUrl: '',
          fromChain: {
            transactionId: '',
            blockNumber: '',
            callEventStatus: '',
            callEventLog: [],
            chainData: {},
            transactionUrl: ''
          },
          toChain: {
            transactionId: '',
            blockNumber: '',
            callEventStatus: '',
            callEventLog: [],
            chainData: {},
            transactionUrl: ''
          },
          timeSpent: {
            total: 65 // More than 1 minute
          },
          routeStatus: []
        }

        pollParams = {
          transactionId: '0xTransactionHash',
          fromChainId: '137',
          toChainId: '1',
          quoteId: 'test-quote-id',
          integratorId: 'test-integrator',
          apiUrl: 'https://api.test.com'
        }

        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockNotFoundResponse)
        })
      })

      it('should throw an error', async () => {
        const promise = pollSquidRouteStatus(pollParams).catch((e: Error) => e)

        // We need to poll enough times for the elapsed time to exceed 60 seconds
        // Polling happens every 5 seconds, so we need at least 13 polls (65 seconds)
        for (let i = 0; i < 13; i++) {
          await jest.advanceTimersByTimeAsync(5000)
        }
        const result = await promise

        expect(result).toBeInstanceOf(Error)
        expect((result as Error).message).toBe('Transaction not found. The transaction may not have been properly submitted.')
      })
    })
  })

  describe('when API returns an error', () => {
    let errorResponse: {
      ok: boolean
      status: number
      statusText: string
      json: () => Promise<{ error: string }>
    }
    let pollParams: PollSquidRouteStatusParams

    beforeEach(() => {
      errorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: 'API Error' })
      }

      pollParams = {
        transactionId: '0xTransactionHash',
        fromChainId: '137',
        toChainId: '1',
        quoteId: 'test-quote-id',
        integratorId: 'test-integrator',
        apiUrl: 'https://api.test.com'
      }

      mockFetch.mockResolvedValueOnce(errorResponse)
    })

    it('should throw an error with API error message', async () => {
      const promise = pollSquidRouteStatus(pollParams)

      await expect(promise).rejects.toThrow('Squid API error: API Error')
    })
  })

  describe('when polling times out', () => {
    let mockOngoingResponse: SquidStatusResponse
    let pollParams: PollSquidRouteStatusParams

    beforeEach(() => {
      mockOngoingResponse = {
        id: '0xTransactionHash',
        status: 'pending',
        gasStatus: '',
        isGMPTransaction: false,
        squidTransactionStatus: SquidTransactionStatus.ONGOING,
        axelarTransactionUrl: '',
        fromChain: {
          transactionId: '0xFromTxHash',
          blockNumber: '12345',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://polygonscan.com/tx/0xFromTxHash'
        },
        toChain: {
          transactionId: '',
          blockNumber: '',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: ''
        },
        timeSpent: {
          total: 30
        },
        routeStatus: []
      }

      pollParams = {
        transactionId: '0xTransactionHash',
        fromChainId: '137',
        toChainId: '1',
        quoteId: 'test-quote-id',
        integratorId: 'test-integrator',
        apiUrl: 'https://api.test.com'
      }

      // Mock fetch to always return ongoing status
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOngoingResponse)
      })
    })

    it('should throw a timeout error after max attempts', async () => {
      const promise = pollSquidRouteStatus(pollParams).catch((e: Error) => e)

      // Polling happens every 5 seconds for max 180 attempts (15 minutes)
      // Advance through all polling attempts
      await jest.runAllTimersAsync()
      const result = await promise

      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe(
        'Cross-chain transaction polling timeout. Please check the Activity page for transaction status.'
      )
    })
  })

  describe('when network error occurs', () => {
    let mockSuccessResponse: SquidStatusResponse
    let pollParams: PollSquidRouteStatusParams

    beforeEach(() => {
      mockSuccessResponse = {
        id: '0xTransactionHash',
        status: 'success',
        gasStatus: '',
        isGMPTransaction: false,
        squidTransactionStatus: SquidTransactionStatus.SUCCESS,
        axelarTransactionUrl: '',
        fromChain: {
          transactionId: '0xFromTxHash',
          blockNumber: '12345',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://polygonscan.com/tx/0xFromTxHash'
        },
        toChain: {
          transactionId: '0xToTxHash',
          blockNumber: '67890',
          callEventStatus: '',
          callEventLog: [],
          chainData: {},
          transactionUrl: 'https://etherscan.io/tx/0xToTxHash'
        },
        timeSpent: {
          total: 120
        },
        routeStatus: []
      }

      pollParams = {
        transactionId: '0xTransactionHash',
        fromChainId: '137',
        toChainId: '1',
        quoteId: 'test-quote-id',
        integratorId: 'test-integrator',
        apiUrl: 'https://api.test.com'
      }

      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSuccessResponse)
        })
    })

    it('should retry on network error and eventually succeed', async () => {
      const promise = pollSquidRouteStatus(pollParams)

      // Advance through retry cycles
      for (let i = 0; i < 3; i++) {
        await jest.advanceTimersByTimeAsync(5000)
      }

      const result = await promise

      expect(result).toEqual(mockSuccessResponse)
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })
})
