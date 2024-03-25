import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TransactionLink } from 'decentraland-dapps/dist/containers'
import { Authorization, AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName, getContract } from 'decentraland-transactions'
import { Modal, Button, ModalNavigation, Loader, Message } from 'decentraland-ui'
import { config } from '../../../../config'
import { Props } from './AuthorizationStep.types'
import styles from './AuthorizationStep.module.css'

const AuthorizationStep = (props: Props) => {
  // Props
  const {
    onCancel,
    address,
    isAuthorizing,
    isConfirmingAuthorization,
    nft,
    error,
    isFetchingAuthorizations,
    onAuthorize,
    onFetchAuthorizations
  } = props

  // State
  const [showError, setShowError] = useState(false)
  const isLoading = isConfirmingAuthorization || isAuthorizing

  // Authorization
  const rentalContractData = getContract(ContractName.Rentals, nft.chainId)
  const authorization: Authorization = useMemo(
    () => ({
      address: address,
      authorizedAddress: rentalContractData.address,
      contractAddress: nft.contractAddress,
      contractName: ContractName.ERC721,
      chainId: nft.chainId,
      type: AuthorizationType.APPROVAL
    }),
    [address, rentalContractData, nft]
  )

  // Handlers
  const handleSubmit = useCallback(() => {
    onAuthorize(authorization)
  }, [onAuthorize, authorization])

  const handleCancel = useCallback(() => {
    setShowError(false)
    onCancel()
  }, [setShowError, onCancel])

  const handleOnInfo = useCallback(() => {
    window.location.href = `${config.get('DOCS_URL')}/player/market/rentals/#list-land-for-rent`
  }, [])

  // Effects
  useEffect(() => {
    if (error && !isConfirmingAuthorization && !isAuthorizing) {
      // show error only when it changes, and it's truthy, and it's not confirming
      setShowError(true)
    } else if (isConfirmingAuthorization) {
      // clear error when it is confirming or is closed
      setShowError(false)
    }
  }, [error, isConfirmingAuthorization, isAuthorizing])

  useEffect(() => {
    onFetchAuthorizations([authorization])
  }, [onFetchAuthorizations, authorization])

  return (
    <>
      <ModalNavigation
        title={t('rental_modal.authorization_step.title')}
        onClose={!isLoading ? onCancel : undefined}
        onInfo={handleOnInfo}
      />
      {isFetchingAuthorizations ? (
        <Modal.Content>
          <div className={styles.loaderContainer}>
            <Loader active size="small" inline />
          </div>
        </Modal.Content>
      ) : (
        <>
          <Modal.Content>
            <div className={styles.notice}>
              <T
                id="rental_modal.authorization_step.notice_line_one"
                values={{
                  assetType: t(`global.${nft.category}`),
                  link: (
                    <TransactionLink address={rentalContractData.address} txHash="" chainId={rentalContractData.chainId}>
                      {t('rental_modal.authorization_step.notice_link')}
                    </TransactionLink>
                  )
                }}
              />
            </div>
            <div className={styles.noticeBox}>
              <p>
                <T id="rental_modal.authorization_step.notice_line_two" />
              </p>
              <ul>
                <li>
                  <b>{t('rental_modal.authorization_step.notice_line_two_option_one_title')}</b>
                  :&nbsp;
                  {t('rental_modal.authorization_step.notice_line_two_option_one_text')}
                </li>
                <li>
                  <b>{t('rental_modal.authorization_step.notice_line_two_option_two_title')}</b>
                  :&nbsp;
                  {t('rental_modal.authorization_step.notice_line_two_option_two_text')}
                </li>
              </ul>
            </div>
          </Modal.Content>

          <Modal.Actions className={styles.actions}>
            {isConfirmingAuthorization ? (
              <div className={styles.confirmTransaction}>
                <Loader active size="small" className={styles.confirmTransactionLoader} />
                <p>{t('rental_modal.authorization_step.confirm')}</p>
              </div>
            ) : (
              <Button primary fluid loading={isLoading} onClick={handleSubmit} disabled={isLoading}>
                {t('global.proceed')}
              </Button>
            )}
            <Button fluid onClick={handleCancel} disabled={isLoading}>
              {t('global.cancel')}
            </Button>
            {showError && <Message className={styles.errorMessage} error size="tiny" visible content={error} header={t('global.error')} />}
          </Modal.Actions>
        </>
      )}
    </>
  )
}

export default React.memo(AuthorizationStep)
