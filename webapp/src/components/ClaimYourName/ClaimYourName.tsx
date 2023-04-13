import React from 'react'
import { Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import claimYourOwnNameImg from '../../images/claim-your-own-name.svg'
import { builderUrl } from '../../lib/environment'
import { Mana } from '../Mana'
import styles from './ClaimYourName.module.css'

const ClaimYourName = () => {
  return (
    <div className={styles.gradient}>
      <div className={styles.container}>
        <img
          className={styles.img}
          src={claimYourOwnNameImg}
          alt="Claim your own name"
        ></img>
        <div>
          <h4 className={styles.title}>{t('claim_your_own_name.title')}</h4>
          <p className={styles.text}>
            <T
              id="claim_your_own_name.text"
              values={{
                mana: <Mana size="small">100</Mana>
              }}
            />
          </p>
        </div>
        <Button className={styles.btn} primary fluid as={'a'} href={`${builderUrl}/names`}>
          {t('claim_your_own_name.btn')}
        </Button>
      </div>
    </div>
  )
}

export default React.memo(ClaimYourName)
