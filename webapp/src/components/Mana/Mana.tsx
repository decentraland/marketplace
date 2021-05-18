import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana as BaseMana, Popup } from 'decentraland-ui'
import { Props } from './Mana.types'

const Mana = (props: Props) => {
  const { withTooltip, ...manaProps } = props
  const Component = <BaseMana {...manaProps} />

  if (withTooltip && !manaProps.network) {
    throw new Error(
      "You need to specify the MANA network if you're going to show a tooltip"
    )
  }

  return withTooltip ? (
    <Popup
      content={t('mana.running_on', {
        network: t(`networks.${manaProps.network?.toLowerCase()}`)
      })}
      position="top center"
      trigger={Component}
    />
  ) : (
    Component
  )
}

export default React.memo(Mana)
