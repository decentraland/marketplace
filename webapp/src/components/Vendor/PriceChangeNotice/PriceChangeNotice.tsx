import React, { useCallback, useEffect, useState } from 'react'
import { Card, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './PriceChangeNotice.types'
import { isAccountView } from '../../../modules/ui/utils'
import './PriceChangeNotice.css'

const PRICE_CHANGE_NOTICE_KEY = 'price-change-notice'

const PriceChangeNotice = (props: Props) => {
  const { view } = props

  const isValidView = useCallback(
    () => view !== undefined && !isAccountView(view),
    [view]
  )

  const isDismissed = localStorage.getItem(PRICE_CHANGE_NOTICE_KEY) !== null
  const [isVisible, setIsVisible] = useState(isValidView())

  useEffect(() => {
    setIsVisible(isValidView())
  }, [setIsVisible, isValidView])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    localStorage.setItem(PRICE_CHANGE_NOTICE_KEY, '1')
  }, [setIsVisible])

  return !isDismissed && isVisible ? (
    <Card fluid className="PriceChangeNotice">
      <Card.Content>
        <Card.Meta>
          <div className="message">{t('price_change_notice.message')}</div>
          <Icon name="close" onClick={handleClose} />
        </Card.Meta>
      </Card.Content>
    </Card>
  ) : null
}

export default React.memo(PriceChangeNotice)
