import React, { useCallback, useEffect } from 'react'
import { PreviewType } from '@dcl/schemas'
import { WearablePreview } from 'decentraland-ui'
import { config } from '../../config'
import { Props } from './UnityPreloader.types'
import './UnityPreloader.css'

const UnityPreloader: React.FC<Props> = props => {
  const { isLoading, isReady, onSetUnityPreloaderStatus } = props

  const handleLoad = useCallback(() => {
    onSetUnityPreloaderStatus(true, false)
  }, [onSetUnityPreloaderStatus])

  const handleError = useCallback(
    (error: Error) => {
      console.error('Unity Preloader error:', error)
      // Even on error, we mark as ready to not block the app
      onSetUnityPreloaderStatus(true, false)
    },
    [onSetUnityPreloaderStatus]
  )

  useEffect(() => {
    if (!isLoading && !isReady) {
      onSetUnityPreloaderStatus(false, true)
    }
  }, [onSetUnityPreloaderStatus, isLoading, isReady])

  // Don't render if already ready
  if (isReady) {
    return null
  }

  return (
    <div className="unity-preloader">
      <WearablePreview
        id="unity-preloader"
        baseUrl={config.get('WEARABLE_PREVIEW_URL')}
        background="#000000"
        unity={true}
        unityMode="marketplace"
        onLoad={handleLoad}
        onError={handleError}
        // Use a minimal configuration to just load Unity
        urns={[]}
        type={PreviewType.WEARABLE}
      />
    </div>
  )
}

export default UnityPreloader
