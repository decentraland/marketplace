import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Popup, useMobileMediaQuery } from 'decentraland-ui'
import { isParcel } from '../../modules/nft/utils'
import { isLandLocked } from '../../modules/rental/utils'
import { Props } from './LandLockedPopup.types'

export const LandLockedPopup = (props: Props) => {
  const { asset, rental, userAddress, children } = props
  const isMobileView = useMobileMediaQuery()

  return (
    <Popup
      content={t('manage_asset_page.land_is_locked', {
        asset: isParcel(asset) ? t('global.the_parcel') : t('global.the_estate')
      })}
      position="top left"
      on={isMobileView ? 'click' : 'hover'}
      disabled={!(rental !== null && isLandLocked(userAddress, rental, asset))}
      trigger={<span>{children}</span>}
    />
  )
}
