import { Props } from './CollectionPage.types'

export const getContractAddressFromProps = (props: Props) =>
  (props.match!.params as any).contractAddress as string
