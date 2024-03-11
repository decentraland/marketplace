import React, { useState } from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './Description.types'
import styles from './Description.module.css'

const MAX_LENGTH = 148

const Description = (props: Props) => {
  const { text } = props
  const hasMoreLines = text?.length && text.length > MAX_LENGTH
  const [showMore, setShowMore] = useState(false)

  return (
    <div className={styles.Description}>
      <Header sub>{t('asset_page.description')}</Header>
      <div className={styles.descriptionText} id="text-container">
        {text ? (hasMoreLines && !showMore ? `${text.substring(0, MAX_LENGTH)}...` : text) : t('asset_page.no_description')}
      </div>
      {hasMoreLines ? (
        <span onClick={() => setShowMore(prevState => !prevState)} className={styles.readMore}>
          {showMore ? t('asset_page.read_less').toLocaleUpperCase() : t('asset_page.read_more').toLocaleUpperCase()}
        </span>
      ) : null}
    </div>
  )
}

export default React.memo(Description)
