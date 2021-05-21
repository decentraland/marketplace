import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana as BaseMana, Popup } from 'decentraland-ui'
import { Props } from './Mana.types'

const Mana = (props: Props) => {
  const { withTooltip, ...manaProps } = props

  if (withTooltip && !manaProps.network) {
    throw new Error(
      "You need to specify the MANA network if you're going to show a tooltip"
    )
  }

  return (
    <Popup
      content={t('mana.running_on', {
        network: t(`networks.${manaProps.network?.toLowerCase()}`)
      })}
      disabled={!withTooltip}
      position="top center"
      trigger={<BaseMana {...manaProps} />}
    />
  )
}

export default React.memo(Mana)
