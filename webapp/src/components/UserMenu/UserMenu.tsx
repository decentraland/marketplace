import React from 'react'
import { UserMenu as BaseUserMenu } from 'decentraland-dapps/dist/containers'
import { IntroPopup } from '../IntroPopup'

export default class UserMenu extends React.PureComponent {
  render() {
    return (
      <>
        <BaseUserMenu {...this.props} />
        <IntroPopup />
      </>
    )
  }
}
