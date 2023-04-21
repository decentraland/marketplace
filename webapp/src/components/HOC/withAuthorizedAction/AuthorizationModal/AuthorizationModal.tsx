import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthorizationAction } from 'decentraland-dapps/dist/modules/authorization/types'
import { Button, Modal } from 'decentraland-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import MultiStep from './MultiStep/MultiStep'
import { AuthorizationStepStatus, Props } from './AuthorizationModal.types'
import styles from './AuthorizationModal.module.css'
import { Step } from './MultiStep/MultiStep.types'
import { getStepMessage, getSteps } from './utils'

const LOADING_STATUS = [
  AuthorizationStepStatus.PROCESSING,
  AuthorizationStepStatus.WAITING
]

export function AuthorizationModal({
  authorization,
  requiredAllowance,
  action,
  authorizationType,
  revokeStatus,
  grantStatus,
  error,
  onClose,
  onRevoke,
  onGrant,
  onAuthorized
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleFinishStep = useCallback(() => {
    setCurrentStep(currentStep + 1)
  }, [currentStep, setCurrentStep])

  const handleRevokeToken = useCallback(() => {
    onRevoke(authorization)
  }, [authorization, onRevoke])

  const handleGrantToken = useCallback(() => {
    onGrant(authorization)
  }, [authorization, onGrant])

  const handleAuthorized = useCallback(() => {
    console.log(onAuthorized())
  }, [onAuthorized])

  const steps = useMemo(() => {
    const authSteps = getSteps(authorizationType, authorization, action, requiredAllowance)
    return [
      ...authSteps,
      {
        title: t('mana_authorization_modal.confirm_transaction.title', {
          action: t(`mana_authorization_modal.${action}.action`)
        }),
        action: t('mana_authorization_modal.confirm_transaction.action'),
        onActionClicked: handleAuthorized
      }
    ].map((step, index) => {
      if (
        'authorizationAction' in step &&
        step.authorizationAction === AuthorizationAction.GRANT
      ) {
        return {
          ...step,
          action:
            grantStatus === AuthorizationStepStatus.DONE
              ? undefined
              : t('mana_authorization_modal.set_cap.action'),
          message: getStepMessage(index, grantStatus, error, currentStep),
          isLoading: LOADING_STATUS.includes(grantStatus),
          onActionClicked: handleGrantToken,
          status: grantStatus
        }
      } else if (
        'authorizationAction' in step &&
        step.authorizationAction === AuthorizationAction.REVOKE
      ) {
        return {
          ...step,
          action:
            revokeStatus === AuthorizationStepStatus.DONE
              ? undefined
              : t('mana_authorization_modal.revoke_cap.action'),
          message: getStepMessage(index, grantStatus, error, currentStep),
          isLoading: LOADING_STATUS.includes(revokeStatus),
          onActionClicked: handleRevokeToken,
          status: revokeStatus
        }
      }

      return step as Step
    })
  }, [
    authorization,
    authorizationType,
    requiredAllowance,
    action,
    grantStatus,
    revokeStatus,
    currentStep,
    error,
    handleGrantToken,
    handleRevokeToken,
    handleAuthorized
  ])

  useEffect(() => {
    const currentStepData = steps[currentStep]
    if (
      'status' in currentStepData &&
      currentStepData.status === AuthorizationStepStatus.DONE
    ) {
      handleFinishStep()
    }
  }, [revokeStatus, grantStatus, steps, currentStep, handleFinishStep])

  return (
    <Modal
      open
      className={styles.modalContainer}
      onClose={onClose}
      data-testid="authorization-modal"
    >
      <Button
        basic
        aria-label={t('global.close')}
        className={styles.closeButton}
        onClick={onClose}
      />
      <h1 className={styles.header}>
        {t('mana_authorization_modal.title', {
          action: t(`mana_authorization_modal.${action}.title_action`)
        })}
      </h1>
      <MultiStep currentStep={currentStep} steps={steps} />
    </Modal>
  )
}
