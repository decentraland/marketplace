import React, { useMemo } from 'react'
import { UserMenu as BaseUserMenu } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { Props } from './UserMenu.types'

const UserMenu = (props: Props) => {
  const { onClickMyAssets, onClickMyLists, ...baseProps } = props

  const menuItems = useMemo(
    () => (
      <>
        <li onClick={onClickMyAssets} role="button" data-testid="my-assets">
          <Icon name="briefcase"></Icon>
          {t('user_menu.my_assets')}
        </li>
        <li onClick={onClickMyLists} role="button" data-testid="my-lists">
          <Icon name="bookmark"></Icon>
          {t('user_menu.my_lists')}
        </li>
      </>
    ),
    [onClickMyAssets, onClickMyLists]
  )

  return <BaseUserMenu {...baseProps} menuItems={menuItems} />
}

export default React.memo(UserMenu)
