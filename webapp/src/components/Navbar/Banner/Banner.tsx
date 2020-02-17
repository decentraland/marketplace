import React, { useState, useCallback } from 'react'
import { Icon } from 'decentraland-ui'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import './Banner.css'

const LEGACY_MARKETPLACE_BANNER_KEY = 'legacy-marektplace-banner'

const getLegacyMarketUrl = () => {
  if (window.location.hostname.endsWith('.zone')) {
    return 'https://land.decentraland.zone'
  }

  if (window.location.hostname.endsWith('.today')) {
    return 'https://land.decentraland.today'
  }

  return 'https://land.decentraland.org'
}

const Banner = () => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem(LEGACY_MARKETPLACE_BANNER_KEY) ? false : true
  )

  const handleClose = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem(LEGACY_MARKETPLACE_BANNER_KEY, '1')
  }, [setIsOpen])

  return isOpen ? (
    <div className="Banner">
      <T
        id="banner.text"
        values={{
          br: <br />,
          link: (
            <a
              href={getLegacyMarketUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <T id="banner.link" />
            </a>
          )
        }}
      ></T>
      <Icon name="close" onClick={handleClose} />
    </div>
  ) : null
}

export default React.memo(Banner)
