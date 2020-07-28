import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { getMaxQuerySize } from '../../../modules/vendor/api'
import { VendorFactory } from '../../../modules/vendor/VendorFactory'
import { Menu } from '../../Menu'
import { MenuItem } from '../../Menu/MenuItem'
import { NFTSections } from '../NFTSections'
import { Props } from './VendorMenu.types'
import './VendorMenu.css'

const VendorMenu = (props: Props) => {
  const { count, currentVendor, address, vendor, section, onClick } = props

  const [isCurrentVendor, setIsCurrentVendor] = useState(
    currentVendor === vendor
  )
  const [isOpen, setIsOpen] = useState(isCurrentVendor)
  const [currentCount, setCurrentCount] = useState(count)

  const isDisabled = !currentCount && !isOpen

  const handleToggleOpen = useCallback(() => {
    if (!isDisabled) {
      setIsOpen(!isOpen)
    }
  }, [isDisabled, isOpen, setIsOpen])

  useEffect(() => {
    const isCurrentVendor = currentVendor === vendor
    setIsCurrentVendor(isCurrentVendor)
    setIsOpen(isCurrentVendor)
  }, [currentVendor, vendor])

  // TODO: Move this to redux and the UI reducer. We should also split it into multiple reducers
  useMemo(async () => {
    if (isCurrentVendor) {
      setCurrentCount(count)
    } else {
      const { nftService } = VendorFactory.build(vendor)
      const newCount = await nftService.count({ address })
      setCurrentCount(newCount)
    }
  }, [isCurrentVendor, vendor, count, address, setCurrentCount])

  const subtitle =
    currentCount === undefined
      ? '...'
      : currentCount === 0
      ? t('vendor_menu.no_assets')
      : currentCount < getMaxQuerySize(vendor)
      ? t('vendor_menu.assets_count', {
          count: currentCount.toLocaleString()
        })
      : t('vendor_menu.more_than_assets_count', {
          count: currentCount.toLocaleString()
        })

  const className = ['VendorMenu']
  if (isCurrentVendor) {
    className.push('active')
  }
  if (isDisabled) {
    className.push('disabled')
  }

  return (
    <div className={className.join(' ')}>
      <Menu>
        <MenuItem
          className="vendor-menu-item"
          value={vendor}
          subtitle={subtitle}
          image={`/${vendor}.png`}
          onClick={handleToggleOpen}
        />
        {isOpen ? (
          <NFTSections
            vendor={vendor}
            section={isCurrentVendor ? section : undefined}
            onSectionClick={onClick}
          />
        ) : null}
      </Menu>
    </div>
  )
}

export default React.memo(VendorMenu)
