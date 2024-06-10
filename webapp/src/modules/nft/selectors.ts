import { AnyAction } from 'redux'
import { createSelector } from 'reselect'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { getNFTContractAddressFromUrl, getNFTTokenIdFromUrl } from '../../utils/routing'
import { RootState } from '../reducer'
import { View } from '../ui/types'
import { FETCH_NFTS_REQUEST, FetchNFTsRequestAction } from './actions'
import { NFTState } from './reducer'
import { NFT } from './types'
import { getNFT } from './utils'

export const getState = (state: RootState) => state.nft
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

const isFetchNftsRequestAction = (action: AnyAction): action is FetchNFTsRequestAction => action.type === FETCH_NFTS_REQUEST

export const isLoadingNftsByView = (state: RootState, view: View | undefined) =>
  getLoading(state).filter((action: AnyAction) => isFetchNftsRequestAction(action) && action.payload?.options?.view === view)

export const getCurrentNFT = createSelector<RootState, NFTState['data'], NFT | null>(
  state => getData(state),
  nfts => {
    const contractAddress = getNFTContractAddressFromUrl()
    const tokenId = getNFTTokenIdFromUrl()
    return getNFT(contractAddress, tokenId, nfts)
  }
)

export const getNFTsByOwner = createSelector<RootState, NFTState['data'], Record<string, NFT[]>>(
  state => getData(state),
  data => {
    const nftsByOwner: Record<string, NFT[]> = {}
    for (const id of Object.keys(data)) {
      const nft = data[id]
      const key = nft.owner.toLowerCase()
      if (!nftsByOwner[key]) {
        nftsByOwner[key] = []
      }
      nftsByOwner[key].push(nft)
    }
    return nftsByOwner
  }
)

export const getWalletNFTs = createSelector<RootState, Record<string, NFT[]>, string | undefined, NFT[]>(
  state => getNFTsByOwner(state),
  state => getAddress(state),
  (nftsByOwner, address) => {
    if (address && address.toLowerCase() in nftsByOwner) {
      return nftsByOwner[address.toLowerCase()]
    }
    return []
  }
)
