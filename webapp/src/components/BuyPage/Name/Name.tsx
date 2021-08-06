import React from 'react'
import { getAssetName } from '../../../modules/asset/utils'
import { Props } from './Name.types'

const Name = (props: Props) => {
  const { asset } = props
  return <b>{getAssetName(asset)}</b>
}

export default React.memo(Name)
