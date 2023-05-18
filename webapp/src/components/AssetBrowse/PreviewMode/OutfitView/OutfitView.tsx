import React, { useCallback } from 'react'
import { WearablePreview } from 'decentraland-ui'
import { Props } from './OutfitView.types'

import './OutfitView.css'
import { getUrn } from '../utils'

const OutfitView: React.FC<Props> = ({ avatar, items }: Props) => {
  const urns = items.map(item => getUrn(item))
  const handleError = useCallback(error => {
    console.warn(error)
  }, [])

  return (
    <WearablePreview
      urns={urns}
      profile={avatar ? avatar.ethAddress : 'default'}
      emote={undefined}
      onError={handleError}
    />
  )
}

export default OutfitView
