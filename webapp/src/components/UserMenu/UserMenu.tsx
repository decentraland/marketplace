import React from 'react'
import { UserMenu as BaseUserMenu } from 'decentraland-dapps/dist/containers'

export default class UserMenu extends React.PureComponent {
  render() {
    return <BaseUserMenu {...this.props} />
  }
}
