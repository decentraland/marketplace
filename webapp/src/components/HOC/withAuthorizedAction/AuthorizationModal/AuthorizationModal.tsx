import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Close, Modal } from 'decentraland-ui'
import { useCallback, useMemo, useState } from 'react'
import MultiStep from './MultiStep/MultiStep'
import { Step } from './MultiStep/MultiStep.types'
import { Props } from './AuthorizationModal.types'
import styles from './AuthorizationModal.module.css'
import { TransactionLink } from 'decentraland-dapps/dist/containers'

export function AuthorizationModal({
  authorization,
  requiredAllowance,
  action,
  shouldAuthorize,
  shouldUpdateAllowance,
  onClose
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleFinishStep = useCallback(() => {
    setCurrentStep(currentStep + 1)
  }, [currentStep, setCurrentStep])

  const steps = useMemo(() => {
    let authorizationSteps: Step[] = []

    if (shouldAuthorize) {
      authorizationSteps = [
        {
          title: t('mana_authorization_modal.authorize.title', {
            contract: () => (
              <TransactionLink
                address={authorization.authorizedAddress}
                chainId={authorization.chainId}
                txHash=""
              >
                {t(`mana_authorization_modal.${action}.contract`)}
              </TransactionLink>
            )
          }),
          description: t('mana_authorization_modal.authorize.description', {
            price: requiredAllowance
          }),
          action: t('mana_authorization_modal.authorize.action'),
          // TODO: Add revoke authorization action
          onActionClicked: handleFinishStep
        }
      ]
    } else if (shouldUpdateAllowance) {
      authorizationSteps = [
        {
          title: t('mana_authorization_modal.revoke_cap.title'),
          description: t('mana_authorization_modal.revoke_cap.description', {
            price: requiredAllowance
          }),
          action: t('mana_authorization_modal.revoke_cap.action'),
          // TODO: Add revoke authorization action
          onActionClicked: handleFinishStep
        },
        {
          title: t('mana_authorization_modal.set_cap.title'),
          description: t('mana_authorization_modal.set_cap.description', {
            price: requiredAllowance
          }),
          action: t('mana_authorization_modal.set_cap.action'),
          // TODO: Add authorization action
          onActionClicked: handleFinishStep
        }
      ]
    }

    authorizationSteps = [
      ...authorizationSteps,
      {
        title: t('mana_authorization_modal.confirm_transaction.title', {
          action: t(`mana_authorization_modal.${action}.action`)
        }),
        action: t('mana_authorization_modal.confirm_transaction.action'),
        onActionClicked: handleFinishStep
      }
    ]

    return authorizationSteps.map((step, index) => ({
      ...step,
      message: index < currentStep ? t('mana_authorization_modal.done') : ''
    }))
  }, [
    handleFinishStep,
    requiredAllowance,
    currentStep,
    action,
    shouldAuthorize,
    shouldUpdateAllowance,
    authorization.authorizedAddress,
    authorization.chainId
  ])

  return (
    <Modal
      open
      className={styles.modalContainer}
      onClose={onClose}
      closeIcon={<Close />}
    >
      <h1 className={styles.header}>
        {t('mana_authorization_modal.title', {
          action: t(`mana_authorization_modal.${action}.title_action`)
        })}
      </h1>
      <MultiStep currentStep={currentStep} steps={steps} />
    </Modal>
  )
}
