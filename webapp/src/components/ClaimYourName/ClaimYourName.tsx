import React, { useEffect } from 'react'
import { Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import claimYourOwnNameImg from '../../images/claim-your-own-name.svg'
import { builderUrl } from '../../lib/environment'
import { Mana } from '../Mana'
import styles from './ClaimYourName.module.css'

const ClaimYourName = () => {
  const g = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { current } = g

    const handler = (e: MouseEvent) => {
      if (current) {
        const x = e.clientX / window.innerWidth
        const degrees = x * 40 - 20
        current.style.background = `linear-gradient(${degrees}deg,#ffbc5b 0%,#ff2d55 50.52%,#c640cd 100%)`
      }
    }

    if (current) {
      current.addEventListener('mousemove', handler)
    }

    return () => {
      if (current) {
        current.removeEventListener('mousemove', handler)
      }
    }
  }, [g])

  return (
    <div ref={g} className={styles.gradient}>
      <div className={styles.container}>
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
        <Button
          className={styles.btn}
          primary
          fluid
          as={'a'}
          href={`${builderUrl}/names`}
        >
          {t('claim_your_own_name.btn')}
        </Button>
      </div>
    </div>
  )
}

export default React.memo(ClaimYourName)