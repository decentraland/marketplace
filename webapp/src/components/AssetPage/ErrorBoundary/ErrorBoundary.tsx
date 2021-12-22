import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Center } from 'decentraland-ui'
import { Props, State } from './ErrorBoundary.types'

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Center>
          <div className="secondary-text">{t('error_boundary.message')}</div>
        </Center>
      )
    }

    return this.props.children
  }
}
