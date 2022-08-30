import React, { useCallback, useMemo } from 'react'
import { Modal, Button, ModalNavigation } from 'decentraland-ui'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { ContractName, getContract } from 'decentraland-transactions'
import { TransactionLink } from 'decentraland-dapps/dist/containers'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './AuthorizationStep.types'
import styles from './AuthorizationStep.module.css'

const AuthorizationStep = (props: Props) => {
  const {
    open,
    onCancel,
    address,
    isAuthorizing,
    isConfirmingAuthorization,
    nft,
    onAuthorize,
    error
  } = props

  const rentalContractData = getContract(ContractName.Rentals, nft.chainId)

  const authorization: Authorization = useMemo(
    () => ({
      address: address!,
      authorizedAddress: rentalContractData.address,
      contractAddress: nft.contractAddress,
      contractName: ContractName.ERC721,
      chainId: nft.chainId,
      type: AuthorizationType.APPROVAL
    }),
    [address, rentalContractData, nft]
  )

  const handleSubmit = useCallback(() => {
    onAuthorize(authorization)
  }, [onAuthorize, authorization])

  return (
    <Modal open={open} size="tiny" className={styles.modal}>
      <ModalNavigation
        title={t('create_rental_modal.title')}
        onClose={onCancel}
      />
      <Modal.Content>
        {
          <div className={styles.notice}>
            <p>
              <T
                id="create_rental_modal.notice_line_one"
                values={{
                  link: (
                    <TransactionLink
                      address={rentalContractData.address}
                      txHash=""
                      chainId={rentalContractData.chainId}
                    >
                      {t('create_rental_modal.notice_link')}
                    </TransactionLink>
                  )
                }}
              ></T>
            </p>
            <p>
              <T id="create_rental_modal.notice_line_two" />
            </p>
          </div>
        }
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          loading={isConfirmingAuthorization || isAuthorizing}
          onClick={handleSubmit}
          disabled={isConfirmingAuthorization || isAuthorizing}
        >
          {t('global.proceed')}
        </Button>
      </Modal.Actions>

      {error && <Modal.Content className={styles.error}>{error}</Modal.Content>}
    </Modal>
  )
}

export default React.memo(AuthorizationStep)
