import * as React from 'react'
import { DefaultProps, Props } from './WalletProvider.types'

export default class WalletProvider extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    children: null
  }

  async UNSAFE_componentWillMount() {
    const { onConnect } = this.props
    onConnect()
  }

  render() {
    const { children } = this.props
    return children
  }
}
