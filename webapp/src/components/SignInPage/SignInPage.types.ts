export type Props = {
  isConnecting: boolean
  isConnected: boolean
}

export type MapStateProps = Pick<Props, 'isConnected' | 'isConnecting'>
