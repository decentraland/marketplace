import React from 'react'
import { Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import claimYourOwnNameImg from '../../images/claim-your-own-name.svg'
import { builderUrl } from '../../lib/environment'
import * as events from '../../utils/events'
import { Mana } from '../Mana'
import styles from './ClaimYourName.module.css'

const ClaimYourName = () => {
  const trackClick = () => {
    getAnalytics().track(events.CLICK_CLAIM_NEW_NAME)
  }

  return (
    <div className={styles.gradient}>
      <div className={styles.container}>
        <div className={styles.imgTitleAndTextContainer}>
          <img
            className={styles.img}
            src={claimYourOwnNameImg}
            alt="Claim your own name"
          ></img>
          <div>
            <h4 className={styles.title}>{t('claim_your_own_name.title')}</h4>
            <div className={styles.text}>
              <T
                id="claim_your_own_name.text"
                values={{
                  mana: <Mana size="small">100</Mana>
                }}
              />
            </div>
          </div>
        </div>
        <Button
          className={styles.btn}
          primary
          fluid
          as={'a'}
          href={`${builderUrl}/claim-name`}
          onClick={trackClick}
          // If the user does right click and opens in new tab, the onClick handler is not triggered.
          // By using onContextMenu, the event will be tracked this way too.
          onContextMenu={trackClick}
        >
          {t('claim_your_own_name.btn')}
        </Button>
      </div>
    </div>
  )
}

export default React.memo(ClaimYourName)
