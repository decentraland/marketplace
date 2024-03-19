import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'
import { getRentalsContractInstance } from './contract'

jest.mock('decentraland-dapps/dist/lib/eth')

const getConnectedProviderMock = getConnectedProvider as jest.MockedFunction<typeof getConnectedProvider>

const providerMock = {
  send: jest.fn()
} as unknown as any

describe('when getting a rental contract instance', () => {
  describe('and the provider is not connected', () => {
    beforeEach(() => {
      getConnectedProviderMock.mockResolvedValueOnce(null)
    })
    it('should throw an error', async () => {
      return expect(getRentalsContractInstance(ChainId.ETHEREUM_GOERLI)).rejects.toThrow('Could not get connected provider')
    })
  })
  describe('and the provider is connected', () => {
    beforeEach(() => {
      getConnectedProviderMock.mockResolvedValueOnce(providerMock)
    })

    it('should return an instance', () => {
      return expect(getRentalsContractInstance(ChainId.ETHEREUM_GOERLI)).resolves.toBeInstanceOf(ethers.Contract)
    })
  })
})
