import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { ContentfulLocale } from '@dcl/schemas'
import { Banner } from 'decentraland-dapps/dist/containers/Banner'
import { getAssets, getBanner } from 'decentraland-dapps/dist/modules/campaign/selectors'
import { RootState } from '../../modules/reducer'
import { Props } from './CampaignBanner.types'
import styles from './CampaignBanner.module.css'

// The width a desktop banner is authored at. Artwork this wide already fills the strip, so it is simply
// drawn across it; anything narrower gets the framed treatment the stylesheet describes.
const FULL_WIDTH_ARTWORK = 1920

/**
 * The native width of the desktop artwork this banner paints, or `undefined` until Contentful answers.
 *
 * Every hop is guarded even where the schema types it as required, the way ui2's own asset readers are:
 * the types describe the Contentful CONTENT TYPE, and a validation relaxed in the space makes the delivery
 * API start omitting a field with no deploy and no warning. A banner has no error boundary above it, so a
 * direct read here would take the whole page down rather than cost the banner its treatment.
 */
const getArtworkWidth = (state: RootState, id: string): number | undefined => {
  const link = getBanner(state, id)?.fullSizeBackground?.[ContentfulLocale.enUS]
  if (!link) return undefined
  return getAssets(state)?.[link.sys.id]?.fields?.file?.[ContentfulLocale.enUS]?.details?.image?.width
}

// Layout wrapper for the Contentful driven campaign banner. Every page that shows one goes through here
// so the artwork gets the same size, gutter and spacing on all of them.
const CampaignBanner = ({ id }: Props) => {
  const artworkWidth = useSelector((state: RootState) => getArtworkWidth(state, id))
  // Framed until the artwork proves it does not need to be: the treatment only ever draws LESS of the
  // strip with stretched art, so it is the safe guess for a banner that has not loaded yet.
  const isFramed = artworkWidth === undefined || artworkWidth < FULL_WIDTH_ARTWORK

  return (
    // The plain class is a stable hook for themes: the module's own name is hashed, and the shop-parity
    // layer has to reach this from the root to tell a page that opens with a banner from one that does not.
    <div className={classNames('CampaignBanner', styles.banner, { [styles.framed]: isFramed })}>
      <Banner id={id} />
    </div>
  )
}

export default React.memo(CampaignBanner)
