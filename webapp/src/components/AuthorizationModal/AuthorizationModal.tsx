import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Modal,
  Button,
  ModalNavigation,
  useMobileMediaQuery
} from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'

import { locations } from '../../modules/routing/locations'
import { isAuthorized } from '../SettingsPage/Authorization/utils'
import { Authorization } from '../SettingsPage/Authorization'
import { Props } from './AuthorizationModal.types'
import './AuthorizationModal.css'
import { isStubMaticCollectionContract } from '../../modules/nft/utils'
import { ethers } from 'ethers'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import ERC721ABI from '../../contracts/ERC721.json'

const AuthorizationModal = (props: Props) => {
  const {
    open,
    authorization,
    authorizations,
    isLoading,
    isAuthorizing,
    getContract,
    onCancel,
    onProceed,
    onUpdateContracts
  } = props

  const isMobile = useMobileMediaQuery()

  const contract = getContract({
    address: authorization.authorizedAddress
  })
  const token = getContract({
    address: authorization.contractAddress
  })

  useEffect(() => {
    if (!contract || !isStubMaticCollectionContract(contract) || isLoading) {
      return
    }

    const updateStubMaticCollectionName = async () => {
      try {
        const provider = await getNetworkProvider(contract.chainId)

        const erc721 = new ethers.Contract(
          contract.address,
          ERC721ABI,
          new ethers.providers.Web3Provider(provider)
        )

        const erc721Name = await erc721.name()

        const updatedContract = {
          ...contract,
          name: erc721Name
        }

        onUpdateContracts([updatedContract], false)
      } catch (e) {
        console.warn((e as Error).message)
      }
    }

    updateStubMaticCollectionName()
  }, [contract, isLoading, onUpdateContracts])

  if (!contract || !token) {
    return null
  }

  return (
    <Modal open={open} size="small" className="AuthorizationModal">
      {!isMobile ? (
        <Modal.Header>
          {t('authorization_modal.title', {
            token: token.name
          })}
        </Modal.Header>
      ) : (
        <ModalNavigation
          title={t('authorization_modal.title', {
            token: token.name
          })}
          onClose={onCancel}
        />
      )}
      <Modal.Description>
        <T
          id="authorization_modal.description"
          values={{
            contract: contract.name,
            token: token.name,
            settings_link: (
              <Link to={locations.settings()}>{t('global.settings')}</Link>
            ),
            br: (
              <>
                <br />
                <br />
              </>
            )
          }}
        />
      </Modal.Description>
      <Modal.Content>
        <Authorization
          key={authorization.authorizedAddress}
          authorization={authorization}
        />
      </Modal.Content>
      <Modal.Actions className="AuthorizationModalActions">
        <Button onClick={onCancel} className="AuthorizationModalButtons">
          {t('global.cancel')}
        </Button>
        <Button
          className="AuthorizationModalButtons"
          primary
          loading={isLoading}
          disabled={
            isLoading ||
            isAuthorizing ||
            !isAuthorized(authorization, authorizations)
          }
          onClick={onProceed}
        >
          {t('global.proceed')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(AuthorizationModal)
