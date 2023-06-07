import React from 'react'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { Props } from './PageLayout.types'
import styles from './PageLayout.module.css'
import classNames from 'classnames'

const PageLayout = ({ children, activeTab, className }: Props) => {
  return (
    <div className={classNames(styles.page, className)}>
      <Navbar isFullscreen />
      <Navigation activeTab={activeTab} />
      <div className={styles.content}>{children}</div>
      <Footer className={styles.footer} />
    </div>
  )
}

export default React.memo(PageLayout)
