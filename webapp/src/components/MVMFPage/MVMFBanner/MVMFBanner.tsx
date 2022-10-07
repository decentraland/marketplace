import React from 'react'
import classNames from 'classnames'
import { Props } from './MVMFBanner.types'
import './MVMFBanner.css'

const MVMFBanner = ({ type }: Props) => {
  return (
    <div className={classNames('MVMFBanner banner-container', type)}>
      Banner goes here
    </div>
  )
}

export default React.memo(MVMFBanner)
