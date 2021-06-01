import * as React from 'react'
import { ToastType } from 'decentraland-ui'
import { env } from 'decentraland-commons'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'

const DISCORD_URL = env.get('REACT_APP_DISCORD_URL', '')

export function getMetaTransactionFailureToast() {
  return {
    type: ToastType.ERROR,
    title: t('toast.meta_transaction_failure.title'),
    body: (
      <T
        id="toast.meta_transaction_failure.body"
        values={{
          br: <br />,
          discord_link: (
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          )
        }}
      />
    ),
    timeout: 6000,
    closable: true
  }
}
