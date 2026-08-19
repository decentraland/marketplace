import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { ChainId } from '@dcl/schemas'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'
import { getChainId, isConnected } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { config } from '../../config'
import { useIsIAP } from '../../modules/iap/useIAP'
import { RootState } from '../../modules/reducer'
import { AnnouncementBar, isAnnouncementBarDismissed } from '../AnnouncementBar'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Props } from './PageLayout.types'
import styles from './PageLayout.module.css'

const useIAPAutoSwitchNetwork = () => {
  const isIAP = useIsIAP()
  const dispatch = useDispatch()
  const walletConnected = useSelector(isConnected)
  const chainId = useSelector((state: RootState) => getChainId(state))

  useEffect(() => {
    if (!isIAP || !walletConnected) return
    const expectedChainId = Number(config.get('CHAIN_ID')) as ChainId
    if (chainId && chainId !== expectedChainId) {
      dispatch(switchNetworkRequest(expectedChainId))
    }
  }, [isIAP, walletConnected, chainId, dispatch])
}

const PageLayout = ({ children, activeTab, className, hideNavigation }: Props) => {
  const isIAP = useIsIAP()
  useIAPAutoSwitchNetwork()

  const [isAnnouncementBarVisible, setIsAnnouncementBarVisible] = useState(() => !isAnnouncementBarDismissed())

  const handleAnnouncementBarDismiss = useCallback(() => setIsAnnouncementBarVisible(false), [])

  const showAnnouncementBar = !isIAP && isAnnouncementBarVisible

  return (
    <div className={classNames(styles.page, className)}>
      <div className={classNames(styles.navbar, { [styles.navbarWithAnnouncement]: showAnnouncementBar })}>
        <Navbar />
        {showAnnouncementBar && <AnnouncementBar onDismiss={handleAnnouncementBarDismiss} />}
      </div>
      {!hideNavigation && <Navigation activeTab={activeTab} />}
      <div className={styles.content}>{children}</div>
      <Footer className={classNames(styles.footer, { 'iap-footer': isIAP })} hideSocialLinks={isIAP} />
    </div>
  )
}

export default React.memo(PageLayout)
