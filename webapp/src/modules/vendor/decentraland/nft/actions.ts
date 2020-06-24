import { fetchNFTsRequest as baseFetchNFTsRequest } from '../../../nft/actions'
import { BaseNFTsParams } from '../../../nft/types'
import { View } from '../../../ui/types'
import { Vendors } from '../../types'
import { NFTsParams } from './types'

export const fetchNFTsRequest = (
  view: View,
  baseParams: Partial<BaseNFTsParams> = {},
  params: Partial<NFTsParams> = {}
) =>
  baseFetchNFTsRequest<NFTsParams>(
    view,
    Vendors.DECENTRALAND,
    baseParams,
    params
  )

export type FetchNFTsRequestAction = ReturnType<typeof fetchNFTsRequest>
