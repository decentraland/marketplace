import { Props } from './CollectionPage.types'

export const getContractAddressFromProps = (props: Props) =>
  (props.match!.params as any).contractAddress as string

export const getBuilderCollectionDetailUrl = (contractAddress: string) =>
  `${process.env.REACT_APP_BUILDER_URL}?redirectTo=${encodeURIComponent(
    JSON.stringify({
      type: 'COLLECTION_DETAIL_BY_CONTRACT_ADDRESS',
      data: { contractAddress }
    })
  )}`
