import React, { useEffect, useState } from 'react'
import { Header, Mana, Button } from 'decentraland-ui'
import { NFTAction } from '../../NFTAction'
import { formatMANA } from '../../../lib/api/mana'
import { getNFTName } from '../../../modules/nft/utils'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { Props } from './BuyModal.types'
import { NFTCategory } from '../../../modules/nft/types'
import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { ESTATE_REGISTRY_ADDRESS } from '../../../modules/contracts'
import { EstateRegistry } from '../../../contracts/EstateRegistry'

const BuyPage = (props: Props) => {
  const {
    nft,
    order,
    onNavigate,
    onExecuteOrder,
    isOwner,
    notEnoughMana
  } = props

  const [fingerprint, setFingerprint] = useState()
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    if (order && order.category === NFTCategory.ESTATE) {
      const eth = Eth.fromCurrentProvider()
      if (eth) {
        const estateRegistry = new EstateRegistry(
          eth,
          Address.fromString(ESTATE_REGISTRY_ADDRESS)
        )
        setLoading(true)
        estateRegistry.methods
          .getFingerprint(nft.tokenId)
          .call()
          .then(result => {
            setFingerprint(result)
            setLoading(false)
          })
      }
    }
  }, [order, setFingerprint])

  let subtitle = null
  if (!order) {
    subtitle = <T id={'buy_page.not_for_sale'} />
  } else if (!fingerprint && order.category === NFTCategory.ESTATE) {
    if (isLoading) {
      subtitle = <T id={'buy_page.loading_fingerprint'} />
    } else {
      subtitle = <T id={'buy_page.no_fingerprint'} />
    }
  } else if (isOwner) {
    subtitle = <T id={'buy_page.is_owner'} />
  } else if (notEnoughMana) {
    subtitle = <T id={'buy_page.not_enough_mana'} />
  } else {
    subtitle = (
      <T
        id={'buy_page.subtitle'}
        values={{
          name: <b className="primary-text">{getNFTName(nft)}</b>,
          amount: <Mana inline>{formatMANA(order.price)}</Mana>
        }}
      />
    )
  }

  const isDisabled =
    !order ||
    isOwner ||
    notEnoughMana ||
    (!fingerprint && order.category === NFTCategory.ESTATE)

  return (
    <NFTAction nft={nft}>
      <Header size="large">{t('buy_page.title')}</Header>
      <div className="subtitle">{subtitle}</div>
      <div className="buttons">
        <Button
          onClick={() =>
            onNavigate(locations.ntf(nft.contractAddress, nft.tokenId))
          }
        >
          {t('global.cancel')}
        </Button>
        <Button
          primary
          disabled={isDisabled}
          onClick={() => onExecuteOrder(order!, nft, fingerprint)}
        >
          {t('buy_page.buy')}
        </Button>
      </div>
    </NFTAction>
  )
}

export default React.memo(BuyPage)
