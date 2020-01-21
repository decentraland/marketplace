import { createSelector } from 'reselect'
import { getData as getNFTs } from '../selectors'
import { RootState } from '../../reducer'
import { NFTState } from '../reducer'

export const getTokenIds = createSelector<
  RootState,
  NFTState['data'],
  Record<string, string>
>(getNFTs, nfts =>
  Object.values(nfts).reduce((tokenIds, nft) => {
    if (nft.parcel) {
      const coords = nft.parcel.x + ',' + nft.parcel.y
      tokenIds[coords] = nft.tokenId
    }
    return tokenIds
  }, {} as Record<string, string>)
)
