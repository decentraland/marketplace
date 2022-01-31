import * as React from 'react'
import { Popup } from 'decentraland-ui'
import { Props } from './Info.types'
import './Info.css'

export default class Info extends React.PureComponent<Props> {
  render() {
    const { className = '', content = '' } = this.props
    return (
      <Popup
        className="info-popup"
        content={content}
        position="top center"
        trigger={<i className={`Info ${className}`} />}
        on="hover"
        inverted
      />
    )
  }
}
