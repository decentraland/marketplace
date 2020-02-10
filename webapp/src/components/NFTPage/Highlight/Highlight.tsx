import React from 'react'

import './Highlight.css'

const Highlight = (props: {
  icon: React.ReactNode
  name: string
  description?: string
  onClick?: () => void
}) => {
  const { icon, name, description, onClick } = props
  const classes = ['Highlight']
  if (onClick) {
    classes.push('clickable')
  }
  return (
    <div className={classes.join(' ')} onClick={onClick}>
      <div className="left">{icon}</div>
      <div className="right">
        <div className="name">{name}</div>
        {description ? <div className="description">{description}</div> : null}
      </div>
    </div>
  )
}

export default React.memo(Highlight)
