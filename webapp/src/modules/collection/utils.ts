import { config } from '../../config'

export const getCollectionManagementUrl = (contractAddress: string) =>
  `${config.get('CREATORS_URL')}/collections?contract=${encodeURIComponent(contractAddress)}`

export const getBuilderCollectionDetailUrl = (contractAddress: string) =>
  `${config.get('BUILDER_URL')}?redirectTo=${encodeURIComponent(
    JSON.stringify({
      type: 'COLLECTION_DETAIL_BY_CONTRACT_ADDRESS',
      data: { contractAddress }
    })
  )}`
