import { PureComponent } from 'react'
import { ethers } from 'ethers'
import { Field, Mana } from 'decentraland-ui'
import { Props } from './ManaField.types'
import './ManaField.css'
import { ManaToFiat } from '../ManaToFiat'

export default class ManaField extends PureComponent<Props> {
  render() {
    const { className, network, value, ...rest } = this.props
    let classes = `ManaField ${network}`
    if (className) {
      classes += ' ' + className
    }
    let mana: string | null = null
    try {
      if (value !== undefined && Number(value) > 0) {
        mana = ethers.utils.parseEther(value).toString()
      }
    } catch (error) {
      // do nothing
    }
    return (
      <Field
        {...rest}
        className={classes}
        value={value}
        icon={
          <>
            <Mana showTooltip network={network} />
            {mana ? (
              <div className="mana-to-fiat">
                <ManaToFiat mana={mana} />
              </div>
            ) : null}
          </>
        }
        iconPosition="left"
      />
    )
  }
}
