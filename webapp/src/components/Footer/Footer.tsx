import React from 'react'
import { FooterProps } from 'decentraland-ui'
import { Footer as BaseFooter } from 'decentraland-dapps/dist/containers'
import * as tranlsations from '../../modules/translation/locales'

const locales = Object.keys(tranlsations)

const Footer = (props: FooterProps) => (
  <BaseFooter locales={locales} {...props} />
)

export default React.memo(Footer)
