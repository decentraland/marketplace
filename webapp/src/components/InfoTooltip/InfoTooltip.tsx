import React from 'react'
import { Popup } from 'decentraland-ui'
import { Props } from './InfoTooltip.types'
import './InfoTooltip.css'

const InfoTooltip = (props: Props) => {
  const { content } = props
  return (
    <Popup
      content={content}
      position="top center"
      trigger={<div className="InfoTooltip" />}
      on="hover"
    />
  )
}

export default React.memo(InfoTooltip)
