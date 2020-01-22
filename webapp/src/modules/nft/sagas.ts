import { takeEvery, call, put } from 'redux-saga/effects'

import {
  FETCH_NFT_REQUEST,
  FetchNFTRequestAction,
  fetchNFTSuccess,
  fetchNFTFailure
} from './actions'
import { marketplace } from '../../lib/api/marketplace'

export function* nftSaga() {
  yield takeEvery(FETCH_NFT_REQUEST, handleFetchNFTRequest)
}

function* handleFetchNFTRequest(action: FetchNFTRequestAction) {
  const { contractAddress, tokenId } = action.payload

  try {
    const [nft, order] = yield call(() =>
      marketplace.fetchNFT(contractAddress, tokenId)
    )
    yield put(fetchNFTSuccess(nft, order))
  } catch (error) {
    yield put(fetchNFTFailure(contractAddress, tokenId, error.message))
  }
}
