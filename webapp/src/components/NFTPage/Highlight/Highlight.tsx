import React from 'react'

import './Highlight.css'

const Highlight = (props: {
  icon: React.ReactNode
  name: string
  description?: string
}) => {
  const { icon, name, description } = props
  return (
    <div className="Highlight">
      <div className="left">{icon}</div>
      <div className="right">
        <div className="name">{name}</div>
        {description ? <div className="description">{description}</div> : null}
      </div>
    </div>
  )
}

export default React.memo(Highlight)
