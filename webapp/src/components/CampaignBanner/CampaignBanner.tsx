import React from 'react'
import { Banner } from 'decentraland-dapps/dist/containers/Banner'
import { Props } from './CampaignBanner.types'
import styles from './CampaignBanner.module.css'

// Layout wrapper for the Contentful driven campaign banner. Every page that shows one goes through here
// so the artwork gets the same size, gutter and spacing on all of them.
const CampaignBanner = ({ id }: Props) => (
  // The plain class is a stable hook for themes: the module's own name is hashed, and the shop-parity
  // layer has to reach this from the root to tell a page that opens with a banner from one that does not.
  <div className={`CampaignBanner ${styles.banner}`}>
    <Banner id={id} />
  </div>
)

export default React.memo(CampaignBanner)
