import React from 'react'
import { Link } from 'react-router-dom'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Loader } from 'decentraland-ui'
import { locations } from '../../modules/routing/locations'
import { Props } from './Wallet.types'
import './Wallet.css'

const Loading = () => (
  <div className="wallet-center">
    <Loader active size="huge" />
  </div>
)

const NotConnected = () => (
  <div className="wallet-center">
    <p className="secondary-text">
      <T
        id="wallet.sign_in_required"
        values={{
          sign_in: <Link to={locations.signIn()}>{t('wallet.sign_in')}</Link>
        }}
      />
    </p>
  </div>
)

const Wallet = (props: Props) => {
  const { wallet, isLoading, children } = props
  return (
    <>
      {isLoading ? <Loading /> : null}
      {!wallet && !isLoading ? <NotConnected /> : null}
      {wallet && !isLoading ? children(wallet) : null}
    </>
  )
}

export default React.memo(Wallet)
