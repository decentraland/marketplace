import React, { useCallback, useRef, useState, useEffect } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Row } from '../Layout/Row'
import { Props } from './Collapsible.types'
import styles from './Collapsible.module.css'

const Collapsible = (props: Props) => {
  const { children, collapsedHeight } = props
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isCollapsible, setIsCollapsible] = useState(false)
  const mainElement = useRef<HTMLDivElement>(null)
  const handleChangeShowMore = useCallback(() => setIsCollapsed(!isCollapsed), [isCollapsed])

  useEffect(() => {
    setIsCollapsed(true)
  }, [children])

  useEffect(() => {
    function setCollapsableUsingHeight() {
      if (!mainElement.current) return

      setIsCollapsible(mainElement.current.offsetHeight > collapsedHeight)
    }

    setCollapsableUsingHeight()
    window.addEventListener('resize', setCollapsableUsingHeight)
    return () => window.removeEventListener('resize', setCollapsableUsingHeight)
  }, [collapsedHeight, children, setIsCollapsible])

  return (
    <div className={styles.Collapsible}>
      <div style={{ height: isCollapsed ? collapsedHeight : 'auto' }} className={styles.collapsibleWrapper}>
        <div ref={mainElement} className={styles.children}>
          {children}
        </div>
      </div>
      {isCollapsible && (
        <Row className={styles.showMore}>
          <span onClick={handleChangeShowMore}>{isCollapsed ? t('parcel_coordinates.show_more') : t('parcel_coordinates.show_less')}</span>
        </Row>
      )}
    </div>
  )
}

export default React.memo(Collapsible)
