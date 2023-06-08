import React from 'react'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { Props } from './PageLayout.types'
import styles from './PageLayout.module.css'

const PageLayout = ({ children, activeTab }: Props) => {
  return (
    <div className={styles.page}>
      <Navbar className={styles.navbar} isFullscreen />
      <Navigation activeTab={activeTab} />
      <div className={styles.content}>{children}</div>
      <Footer className={styles.footer} />
    </div>
  )
}

export default React.memo(PageLayout)
