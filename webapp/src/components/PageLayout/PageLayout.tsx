import React from 'react'
import classNames from 'classnames'
import { useIsIAP } from '../../modules/iap/useIAP'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { Props } from './PageLayout.types'
import styles from './PageLayout.module.css'

const PageLayout = ({ children, activeTab, className, hideNavigation }: Props) => {
  const isIAP = useIsIAP()

  return (
    <div className={classNames(styles.page, className)}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      {!hideNavigation && <Navigation activeTab={activeTab} />}
      <div className={styles.content}>{children}</div>
      <Footer className={classNames(styles.footer, { 'iap-footer': isIAP })} hideSocialLinks={isIAP} />
    </div>
  )
}

export default React.memo(PageLayout)
