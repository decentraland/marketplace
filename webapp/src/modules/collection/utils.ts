export const getBuilderCollectionDetailUrl = (contractAddress: string) =>
  `${process.env.REACT_APP_BUILDER_URL}?redirectTo=${encodeURIComponent(
    JSON.stringify({
      type: 'COLLECTION_DETAIL_BY_CONTRACT_ADDRESS',
      data: { contractAddress }
    })
  )}`
