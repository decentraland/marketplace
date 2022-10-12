import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Button, Container } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import * as decentraland from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import { VendorName } from '../../../modules/vendor'
import { SortBy } from '../../../modules/routing/types'
import { Props } from './MVMFBanner.types'
import './MVMFBanner.css'
import { AssetType } from '../../../modules/asset/types'

const MVMFBanner = ({
  type,
  onNavigate,
  isMVMFEnabled,
  isMVMFAnnouncementEnabled
}: Props) => {
  const content = useMemo(() => {
    switch (type) {
      case 'big':
        return (
          <>
            <a
              href="https://events.decentraland.org/event/?id=7148716b-ff25-4d5f-8267-55fed7ab15bc"
              target="blank"
              className="event-badge-container"
              rel="noopener noreferrer"
            >
              <span className="icon"></span>
              {t('mvmf22.banners.big.event')}
            </a>
            <span className="title">
              {isMVMFEnabled ? (
                t('mvmf22.banners.big.title')
              ) : (
                <T
                  id="mvmf22_announcement.banners.big.title"
                  values={{
                    enter: <br></br>
                  }}
                />
              )}
            </span>
            <span className="subtitle">
              {isMVMFEnabled ? (
                t('mvmf22.banners.big.subtitle')
              ) : (
                <T
                  id="mvmf22_announcement.banners.big.subtitle"
                  values={{
                    subtitle_bold_1: (
                      <b>
                        {t('mvmf22_announcement.banners.big.subtitle_bold_1')}
                      </b>
                    ),
                    subtitle_bold_2: (
                      <b>
                        {t('mvmf22_announcement.banners.big.subtitle_bold_2')}
                      </b>
                    ),
                    subtitle_bold_3: (
                      <b>
                        {t('mvmf22_announcement.banners.big.subtitle_bold_3')}
                      </b>
                    ),
                    enter: <br></br>
                  }}
                />
              )}
            </span>
            {isMVMFEnabled ? (
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
            ) : (
              <Button
                className="announcement"
                as={'a'}
                target="_blank"
                rel="noopener noreferrer"
                href={'link'}
              >
                {t('mvmf22_announcement.banners.big.cta')}
              </Button>
            )}
          </>
        )

      case 'medium':
        return (
          <>
            <span className="title">{t('mvmf22.banners.medium.title')} </span>
            <span className="subtitle">
              <T
                id="mvmf22.banners.medium.subtitle"
                values={{
                  subtitle_bold_1: (
                    <b>{t('mvmf22.banners.medium.subtitle_bold_1')}</b>
                  )
                }}
              />
            </span>
          </>
        )

      case 'small':
        return (
          <>
            <div className="small-text-container">
              <span className="title">
                {isMVMFEnabled
                  ? t('mvmf22.banners.small.title')
                  : t('mvmf22_announcement.banners.small.title')}
              </span>
              <span className="subtitle">
                {isMVMFEnabled ? (
                  t('mvmf22.banners.small.subtitle')
                ) : (
                  <T
                    id="mvmf22_announcement.banners.small.subtitle"
                    values={{
                      subtitle_bold_1: (
                        <b>
                          {t(
                            'mvmf22_announcement.banners.small.subtitle_bold_1'
                          )}
                        </b>
                      ),
                      subtitle_bold_2: (
                        <b>
                          {t(
                            'mvmf22_announcement.banners.small.subtitle_bold_2'
                          )}
                        </b>
                      ),
                      enter: <br></br>
                    }}
                  />
                )}
              </span>
            </div>
            {isMVMFEnabled ? (
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
            ) : (
              <Button
                className="announcement"
                as={'a'}
                target="_blank"
                rel="noopener noreferrer"
                href="https://decentraland.org/blog/announcements/emotes-contest-prepare-your-best-moves-for-the-metaverse-music-festival"
              >
                {t('mvmf22_announcement.banners.big.cta')}
              </Button>
            )}
          </>
        )

      default:
        break
    }
  }, [isMVMFEnabled, onNavigate, type])

  return isMVMFEnabled || isMVMFAnnouncementEnabled ? (
    <div className={classNames('MVMFBanner banner-container', type)}>
      <Container>
        <div className="banner">{content}</div>
      </Container>
    </div>
  ) : null
}

export default React.memo(MVMFBanner)
