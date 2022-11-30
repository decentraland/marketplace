import React, { useState } from 'react'
import { Network } from '@dcl/schemas'
import { Loader, Mana, Mobile, NotMobile, Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { LinkedProfile } from '../../LinkedProfile'
import { formatWeiMANA } from '../../../lib/mana'
import { ManaToFiat } from '../../ManaToFiat'
import { AssetType } from '../../../modules/asset/types'
import { Section } from '../../../modules/vendor/decentraland'
import { Props } from './RankingCreatorRow.types'
import './RankingCreatorRow.css'

const RankingCreatorRow = ({ entity }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const renderMobile = () => {
    const creatorAddress = entity.id
    return (
      <div className="RankingCreatorRow rankings-creator-cell">
        <div>
          <div className="rankings-creator-data">
            <LinkedProfile
              address={creatorAddress}
              inline={false}
              size="large"
              browseOptions={{
                assetType: AssetType.ITEM,
                section: Section.WEARABLES
              }}
            />
            <span className="rankings-creator-collections-created">
              {t('home_page.analytics.rankings.creators.collections_created', {
                collections: entity.collections
              })}
            </span>
          </div>
          <div className="rankings-creator-right-data">
            <>
              <Mana network={Network.MATIC} inline>
                {entity.earned && formatWeiMANA(entity.earned)}
              </Mana>
              <span className="rankings-fiat-price">
                {entity.earned && (
                  <>
                    (<ManaToFiat mana={entity.earned} />)
                  </>
                )}
              </span>
              <div
                className="arrow-container"
                onClick={() => setExpanded(!expanded)}
              >
                <span> {t(`global.${expanded ? 'less' : 'more'}`)} </span>
                <i className={`caret back ${expanded ? 'up' : ''}`} />
              </div>
            </>
          </div>
        </div>
        {expanded ? (
          <div>
            <div className="rankings-creator-more-data-container">
              <div>
                <span>
                  {t('home_page.analytics.rankings.creators.unique_collectors')}
                </span>
                {entity.uniqueCollectors}
              </div>
              <div>
                <span>
                  {t('home_page.analytics.rankings.creators.items_sold')}
                </span>
                {entity.sales}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  const renderNotMobile = () => {
    const creatorAddress = entity.id
    return (
      <Table.Row key={entity.id}>
        {!entity ? (
          <Loader active inline />
        ) : (
          <>
            <Table.Cell width={5}>
              <div className="rankings-creator-cell">
                <LinkedProfile
                  address={creatorAddress}
                  inline={false}
                  size="large"
                  browseOptions={{
                    assetType: AssetType.ITEM,
                    section: Section.WEARABLES
                  }}
                />
              </div>
            </Table.Cell>
            <Table.Cell width={3}>{entity.collections}</Table.Cell>
            <Table.Cell width={2}>{entity.sales}</Table.Cell>
            <Table.Cell width={3}>{entity.uniqueCollectors}</Table.Cell>
            <Table.Cell>
              <Mana network={Network.MATIC} inline>
                {entity.earned && formatWeiMANA(entity.earned)}
              </Mana>
              <span className="rankings-fiat-price">
                {entity.earned && (
                  <>
                    (<ManaToFiat mana={entity.earned} />)
                  </>
                )}
              </span>
            </Table.Cell>
          </>
        )}
      </Table.Row>
    )
  }

  return (
    <>
      <Mobile>{renderMobile()}</Mobile>
      <NotMobile>{renderNotMobile()}</NotMobile>
    </>
  )
}

export default React.memo(RankingCreatorRow)
