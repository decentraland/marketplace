export type Props = {
  isAuthDappEnabled: boolean
  isConnecting: boolean
  isConnected: boolean
}

export type MapStateProps = Pick<
  Props,
  'isAuthDappEnabled' | 'isConnected' | 'isConnecting'
>
