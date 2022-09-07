import { memo } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'
import { Box } from '../../AssetBrowse/Box'
import { Props } from './Details.types'
import styles from './Details.module.css'

const Info = ({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className={styles.detail}>
    <div className={styles.detailTitle}>{title}</div>
    <div className={styles.detailContent}>{children}</div>
  </div>
)

const Details = (props: Props) => {
  const { nft, className } = props

  return (
    <Box
      header={t('manage_asset_page.details.title')}
      className={classNames(className)}
    >
      <div className={styles.content}>
        <Info title={t('manage_asset_page.details.network')}>
          <span>{nft.network}</span>
        </Info>
        <Info title={t('manage_asset_page.details.owner')}>
          <Profile hasPopup={true} address={nft.owner} />
        </Info>
      </div>
    </Box>
  )
}

export default memo(Details)
