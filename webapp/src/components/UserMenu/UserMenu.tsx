import React from 'react'
import { UserMenuProps } from 'decentraland-ui'
import { UserMenu as BaseUserMenu } from 'decentraland-dapps/dist/containers'
import { IntroPopup } from '../IntroPopup'

export default class UserMenu extends React.PureComponent<
  Partial<UserMenuProps>
> {
  render() {
    return (
      <>
        <BaseUserMenu {...this.props} />
        <IntroPopup />
      </>
    )
  }
}
