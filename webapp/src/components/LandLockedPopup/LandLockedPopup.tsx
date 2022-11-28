import { Popup, useMobileMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isParcel } from '../../modules/nft/utils'
import { isLandLocked } from '../../modules/rental/utils'

export const LandLockedPopup = (props: any) => {
  const { asset, rental, address, children } = props
  const isMobileView = useMobileMediaQuery()

  return (
    <Popup
      content={t('manage_asset_page.land_is_locked', {
        asset: isParcel(asset) ? t('global.the_parcel') : t('global.the_estate')
      })}
      position="top left"
      on={isMobileView ? 'click' : 'hover'}
      disabled={!(rental !== null && isLandLocked(address, rental, asset))}
      trigger={<span>{children}</span>}
    />
  )
}
