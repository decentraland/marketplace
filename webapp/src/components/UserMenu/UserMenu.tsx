import * as React from 'react'
import { UserMenu as BaseUserMenu, Row, Menu, Icon } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { Props, State } from './UserMenu.types'
import './UserMenu.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

export default class UserMenu extends React.Component<Props, State> {
  render() {
    const {
      profile,
      mana,
      onLogout,
      pathname,
      hasPendingTransactions,
      onNavigate
    } = this.props
    return (
      <Row>
        <Menu.Item
          className={
            pathname === locations.activity()
              ? 'ActivityBell active'
              : 'ActivityBell'
          }
        >
          <Icon
            className={hasPendingTransactions ? 'pending' : ''}
            name="bell"
            onClick={() => onNavigate(locations.activity())}
          />
        </Menu.Item>
        <BaseUserMenu
          menuItems={
            <Menu.Item onClick={() => onNavigate(locations.settings())}>
              <Icon name="cog"></Icon>
              {t('global.settings')}
            </Menu.Item>
          }
          mana={mana}
          isSignedIn
          onSignOut={onLogout}
          avatar={profile ? profile.avatars[0] : undefined}
        />
      </Row>
    )
  }
}
