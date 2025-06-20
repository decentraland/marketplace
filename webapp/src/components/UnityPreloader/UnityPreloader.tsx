import React, { useCallback, useEffect } from 'react'
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
      console.error('Unity Preload', error)
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
        unity={true}
        unityMode="profile"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

export default UnityPreloader
