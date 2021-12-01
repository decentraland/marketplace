import React from 'react'
// import { Link } from 'react-router-dom'
import {
  // Button,
  Container,
  Header,
  Stats
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Rarity } from '@dcl/schemas'
// import { formatMANA } from '../../../lib/mana'
// import { locations } from '../../../modules/routing/locations'
import { AssetImage } from '../../AssetImage'
import { PageHeader } from '../../PageHeader'
// import { Mana } from '../../Mana'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './WearableDetail.types'
import Title from '../V2/Title'
import RarityBadge from '../V2/RarityBadge'
import { AssetType } from '../../../modules/asset/types'
import GenderBadge from '../V2/GenderBadge'
import CategoryBadge from '../V2/CategoryBadge'
import { Box } from '../../AssetBrowse/Box'
import { Owner } from '../V2/Owner'
import Collection from '../V2/Collection'
import ListedBadge from '../../ListedBadge'
// import { OrderDetails } from '../OrderDetails'
import styles from './WearableDetail.module.css'
import Price from '../V2/Price'
import Expiration from '../V2/Expiration'
import { Actions } from '../Actions'

const WearableDetail = ({ nft }: Props) => {
  const wearable = nft.data.wearable!
  // const isOwner = wallet?.address === item.creator
  // const canBuy = item.isOnSale && item.available > 0

  return (
    <div className={styles.detail}>
      <PageHeader>
        <AssetImage asset={nft} isDraggable />
        {!!nft.activeOrderId && <ListedBadge className={styles.listedBadge} />}
      </PageHeader>
      <Container>
        <div className={styles.info}>
          <div className={styles.left}>
            <div>
              <Title asset={nft} />
              <div className={styles.badges}>
                <RarityBadge
                  rarity={wearable.rarity}
                  assetType={AssetType.NFT}
                />
                <CategoryBadge wearable={wearable} assetType={AssetType.NFT} />
                <GenderBadge wearable={wearable} assetType={AssetType.NFT} />
              </div>
            </div>
            <Description text={wearable.description} />
            <div className={styles.ownerAndCollection}>
              <Owner asset={nft} />
              <Collection asset={nft} />
            </div>
          </div>
          <div className={styles.right}>
            <Box className={styles.box}>
              <Price asset={nft} />
              <div className={styles.stockAndNetwork}>
                {nft.issuedId ? (
                  <Stats title={t('global.issue_number')}>
                    <Header>
                      {Number(nft.issuedId).toLocaleString()}
                      <span className="issue-number">
                        /{Rarity.getMaxSupply(wearable.rarity).toLocaleString()}
                      </span>
                    </Header>
                  </Stats>
                ) : null}
                <Network asset={nft} />
              </div>
              <Actions nft={nft} />
              <Expiration />
            </Box>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default React.memo(WearableDetail)
