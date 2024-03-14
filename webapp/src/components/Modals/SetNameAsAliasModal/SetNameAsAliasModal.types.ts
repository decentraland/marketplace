import { Dispatch } from 'redux'
import { Profile } from '@dcl/schemas'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { setProfileAvatarAliasRequest } from 'decentraland-dapps/dist/modules/profile/actions'

export type Props = Omit<ModalProps, 'metadata'> & {
  isLoading: boolean
  address?: string
  profile: Profile | undefined
  metadata: {
    name: string
  }
  onSubmit: typeof setProfileAvatarAliasRequest
} & WithAuthorizedActionProps

export type MapState = Pick<Props, 'address' | 'isLoading' | 'profile'>
export type MapDispatch = Dispatch
export type MapDispatchProps = Pick<Props, 'onSubmit'>
