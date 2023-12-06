import { Dispatch } from 'react'
import { CallHistoryMethodAction } from 'connected-react-router'

export type Props = {
  currentMana: number | undefined
  onBrowse: () => void
}

export type MapStateProps = Pick<Props, 'currentMana'>

export type MapDispatchProps = Pick<Props, 'onBrowse'>

export type MapDispatch = Dispatch<CallHistoryMethodAction>
