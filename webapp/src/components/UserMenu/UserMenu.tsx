import React, { useCallback } from 'react'
import { UserMenu as BaseUserMenu } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { Props } from './UserMenu.types'

const UserMenu = (props: Props) => {
  const {
    isFavoritesEnabled,
    onClickMyAssets,
    onClickMyLists,
    ...baseProps
  } = props

  const getMenuItems = useCallback(
    () => (
      <>
        <li onClick={onClickMyAssets} role="button">
          <Icon name="briefcase"></Icon>
          {t('user_menu.my_assets')}
        </li>
        {isFavoritesEnabled ? (
          <li onClick={onClickMyLists} role="button">
            <Icon name="bookmark"></Icon>
            {t('user_menu.my_lists')}
          </li>
        ) : null}
      </>
    ),
    [isFavoritesEnabled, onClickMyAssets, onClickMyLists]
  )

  return <BaseUserMenu {...baseProps} menuItems={getMenuItems()} />
}

export default React.memo(UserMenu)
