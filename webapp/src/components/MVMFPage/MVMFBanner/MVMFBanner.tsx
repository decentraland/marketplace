import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Button, Container } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import * as decentraland from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import { VendorName } from '../../../modules/vendor'
import { SortBy } from '../../../modules/routing/types'
import { Props } from './MVMFBanner.types'
import './MVMFBanner.css'
import { AssetType } from '../../../modules/asset/types'

const MVMFBanner = ({ type, onNavigate, isMVMFEnabled }: Props) => {
  const content = useMemo(() => {
    switch (type) {
      case 'big':
        return (
          <>
            <span className="title">{t('mvmf22.banners.big.title')} </span>
            <span className="subtitle">{t('mvmf22.banners.big.subtitle')}</span>
            <Button
              onClick={() =>
                onNavigate(
                  locations.MVMF22({
                    section: decentraland.Section.WEARABLES,
                    vendor: VendorName.DECENTRALAND,
                    page: 1,
                    sortBy: SortBy.RECENTLY_LISTED,
                    onlyOnSale: true,
                    assetType: AssetType.ITEM
                  })
                )
              }
            >
              {t('mvmf22.banners.big.cta')}
            </Button>
          </>
        )

      case 'medium':
        return (
          <>
            <span className="title">{t('mvmf22.banners.medium.title')} </span>
            <span className="subtitle">
              {t('mvmf22.banners.medium.subtitle')}
            </span>
          </>
        )

      case 'small':
        return (
          <>
            <div className="small-text-container">
              <span className="title">{t('mvmf22.banners.small.title')} </span>
              <span className="subtitle">
                {t('mvmf22.banners.small.subtitle')}
              </span>
            </div>
            <Button
              onClick={() =>
                onNavigate(
                  locations.MVMF22({
                    section: decentraland.Section.WEARABLES,
                    vendor: VendorName.DECENTRALAND,
                    page: 1,
                    sortBy: SortBy.RECENTLY_LISTED,
                    onlyOnSale: true,
                    assetType: AssetType.ITEM
                  })
                )
              }
            >
              {t('mvmf22.banners.big.cta')}
            </Button>
          </>
        )

      default:
        break
    }
  }, [onNavigate, type])

  return isMVMFEnabled ? (
    <div className={classNames('MVMFBanner banner-container', type)}>
      <Container>
        <div className="banner">{content}</div>
      </Container>
    </div>
  ) : null
}

export default React.memo(MVMFBanner)
