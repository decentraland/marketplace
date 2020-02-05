import React from 'react'

import { NFTListPage } from '../../NFTListPage'
import { View } from '../../../modules/ui/types'
import { Props } from './AddressNFTs.types'

const AddressNFTs = (props: Props) => {
  const { address, onNavigate } = props
  return (
    <NFTListPage
      address={address}
      defaultOnlyOnSale={false}
      view={View.ACCOUNT}
      onNavigate={onNavigate}
    />
  )
}

export default React.memo(AddressNFTs)
