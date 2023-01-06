import React, { useCallback, useState, useEffect } from 'react'
import classNames from 'classnames'
import { Button, Icon, useNotMobileMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './BackToTopButton.types'
import styles from './BackToTopButton.module.css'

const MIN_HEIGHT_SCROLL_BACK = 500
const DEFAULT_SCROLL_TO_OPTS = { top: 0, behavior: 'smooth' as ScrollBehavior }

const BackToTopButton = ({
  className,
  threshold = MIN_HEIGHT_SCROLL_BACK,
  scrollToOptions = DEFAULT_SCROLL_TO_OPTS
}: Props) => {
  const isDesktop = useNotMobileMediaQuery()
  const [showButton, setShowButton] = useState(false)
  useEffect(() => {
    const scrollListener = () => {
      setShowButton(window.scrollY > threshold)
    }
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [threshold])

  const handleBackToTop = useCallback(() => {
    window.scrollTo(scrollToOptions)
  }, [scrollToOptions])

  return showButton ? (
    <Button
      className={classNames(className, styles.backToTop)}
      onClick={handleBackToTop}
    >
      <Icon name="arrow up" />
      {isDesktop ? t('browse_page.back_to_top') : null}
    </Button>
  ) : null
}

export default React.memo(BackToTopButton)
