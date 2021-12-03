import React from 'react'
import { Container } from 'decentraland-ui'
import { AssetImage } from '../../AssetImage'
import { PageHeader } from '../../PageHeader'
import Title from '../Title'
import { Box } from '../../AssetBrowse/Box'
import ListedBadge from '../../ListedBadge'
import { Props } from './BaseDetail.types'
import styles from './BaseDetail.module.css'
import './BaseDetail.css'

const BaseDetail = ({
  asset,
  assetImageProps,
  isOnSale,
  badges,
  left,
  box,
  below
}: Props) => {
  return (
    <div className={styles.detail}>
      <PageHeader>
        <AssetImage asset={asset} {...assetImageProps} />
        {isOnSale && <ListedBadge className={styles.listedBadge} />}
      </PageHeader>
      <Container>
        <div className={styles.info}>
          <div className={styles.left}>
            <div>
              <Title asset={asset} />
              <div className={styles.badges}>{badges}</div>
            </div>
            {left}
          </div>
          <div className={styles.right}>
            <Box className={styles.box}>{box}</Box>
          </div>
        </div>
        {below}
      </Container>
    </div>
  )
}

export default React.memo(BaseDetail)
