import React, { useCallback } from 'react'
import { UserInformation as BaseUserMenu } from 'decentraland-dapps/dist/containers'
import { Props } from './UserInformation.types'
import { config } from '../../config'

const UserInformation = (props: Props) => {
  const {
    onClickMyAssets,
    onClickMyLists,
    onClickSettings,
    onSignIn,
    isAuthDappEnabled,
    ...baseProps
  } = props

  const handleOnSignIn = useCallback(() => {
    if (isAuthDappEnabled) {
      window.location.replace(
        `${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(
          window.location.href
        )}`
      )
    } else if (onSignIn) {
      onSignIn()
    }
  }, [onSignIn, isAuthDappEnabled])
  return (
    <BaseUserMenu
      {...baseProps}
      onClickMyAssets={onClickMyAssets}
      onClickMyLists={onClickMyLists}
      onClickSettings={onClickSettings}
      onSignIn={handleOnSignIn}
    />
  )
}

export default React.memo(UserInformation)
