import React from 'react'
import { Button } from 'decentraland-ui'
import claimYourOwnNameImg from '../../images/claim-your-own-name.svg'
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
          <h4 className={styles.title}>CLAIM YOUR OWN NAME</h4>
          <p className={styles.text}>
            In this Marketplace section you can find NAMEs that are being resold
            by community members. Alternatively, you can claim your own unique
            NAME from the Builder section for a fixed price of 100.
          </p>
        </div>
        <Button className={styles.btn} primary fluid>
          CLAIM YOUR NAME
        </Button>
      </div>
    </div>
  )
}

export default React.memo(ClaimYourName)
