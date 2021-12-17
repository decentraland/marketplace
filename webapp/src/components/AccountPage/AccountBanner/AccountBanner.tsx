import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Icon } from 'semantic-ui-react'
import { Profile } from 'decentraland-dapps/dist/containers'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { PageHeader } from '../../PageHeader'
import { Column } from '../../Layout/Column'
import { Props } from './AccountBanner.types'
import { useTimer } from '../../../lib/timer'
import { shortenAddress } from '../../../modules/wallet/utils'
import './AccountBanner.css'

const AccountBanner = ({ address, store }: Props) => {
  const [hasCopiedAddress, setHasCopiedAddress] = useTimer(1200)

  return (
    <PageHeader className="AccountBanner">
      {store?.cover && <img className="cover" src={store.cover} alt="cover" />}
      <Column>
        <Profile address={address} imageOnly inline={false} />
        <div className="profile-name">
          <Profile address={address} textOnly inline={false} />
        </div>
        <div className="profile-address">
          <div className="profile-address-hash">{shortenAddress(address)}</div>
          {!isMobile() && (
            <div>
              <CopyToClipboard text={address} onCopy={setHasCopiedAddress}>
                <Icon
                  aria-label="Copy address"
                  aria-hidden="false"
                  className="copy"
                  name="copy outline"
                />
              </CopyToClipboard>
              {hasCopiedAddress && (
                <span className="profile-copied-text-desktop copied">
                  {t('account_page.copied')}
                </span>
              )}
            </div>
          )}
        </div>
        {isMobile() && (
          <div className="profile-copy-text-mobile">
            <CopyToClipboard text={address} onCopy={setHasCopiedAddress}>
              {hasCopiedAddress ? (
                <span className="copied">
                  {t('account_page.copied_capitalized')}
                </span>
              ) : (
                <span className="copy">{t('account_page.copy_address')}</span>
              )}
            </CopyToClipboard>
          </div>
        )}
        {store?.description && (
          <div className="description">{store.description}</div>
        )}
      </Column>
    </PageHeader>
  )
}

export default React.memo(AccountBanner)
