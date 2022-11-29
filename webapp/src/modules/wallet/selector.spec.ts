import { ChainId, Network } from '@dcl/schemas'
import { RootState } from '../reducer'
import { getMana } from './selectors'

describe("when getting the user's MANA of a network", () => {
  let state: RootState
  beforeEach(() => {
    state = {
      wallet: {
        data: null
      }
    } as RootState
  })

  describe("and there's no wallet logged in", () => {
    it('should return undefined', () => {
      expect(getMana(state, Network.ETHEREUM)).toBe(undefined)
    })
  })

  describe("and there's a wallet logged in", () => {
    beforeEach(() => {
      state = {
        wallet: {
          data: {
            networks: {
              [Network.ETHEREUM]: {
                mana: 10000,
                chainId: ChainId.ETHEREUM_GOERLI
              }
            }
          }
        }
      } as RootState
    })

    it('should return the MANA of the wallet in the provided network', () => {
      expect(getMana(state, Network.ETHEREUM)).toBe(10000)
    })
  })
})
