import { useCallback, useEffect, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthorizationAction } from 'decentraland-dapps/dist/modules/authorization/types'
import { Button, Modal } from 'decentraland-ui'
import MultiStep from './MultiStep/MultiStep'
import { AuthorizationStepStatus, Props } from './AuthorizationModal.types'
import styles from './AuthorizationModal.module.css'
import { Step } from './MultiStep/MultiStep.types'
import { getStepMessage, getSteps } from './utils'

const LOADING_STATUS = [
  AuthorizationStepStatus.LOADING_INFO,
  AuthorizationStepStatus.PROCESSING,
  AuthorizationStepStatus.WAITING
]

export function AuthorizationModal({
  authorization,
  requiredAllowance,
  currentAllowance,
  action,
  authorizationType,
  revokeStatus,
  grantStatus,
  confirmationStatus,
  error,
  confirmationError,
  network,
  getContract,
  onClose,
  onRevoke,
  onGrant,
  onAuthorized,
  onFetchAuthorizations
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loadingStep, setLoadingStep] = useState<number>()

  useEffect(() => {
    onFetchAuthorizations([authorization])
  }, [authorization, onFetchAuthorizations])

  const handleRevokeToken = useCallback(() => {
    onRevoke(authorization)
    setLoadingStep(currentStep)
  }, [authorization, currentStep, setLoadingStep, onRevoke])

  const handleGrantToken = useCallback(() => {
    onGrant(authorization)
    setLoadingStep(currentStep)
  }, [authorization, currentStep, setLoadingStep, onGrant])

  const handleAuthorized = useCallback(() => {
    onAuthorized()
    setLoadingStep(currentStep)
  }, [currentStep, setLoadingStep, onAuthorized])

  const authorizedContract = getContract({
    address: authorization.authorizedAddress
  })

  const steps = useMemo(() => {
    const authSteps = getSteps({
      authorizationType,
      network,
      requiredAllowance,
      currentAllowance,
      contract: authorizedContract
    })
    const confirmationIndex = authSteps.length
    return [
      ...authSteps,
      {
        title: t('mana_authorization_modal.confirm_transaction.title', {
          action: t(`mana_authorization_modal.${action}.action`)
        }),
        action: t('mana_authorization_modal.confirm_transaction.action'),
        onActionClicked: handleAuthorized,
        testId: 'confirm-action-step',
        status: confirmationStatus,
        isLoading:
          LOADING_STATUS.includes(confirmationStatus) ||
          confirmationIndex === loadingStep,
        message: getStepMessage(
          confirmationIndex,
          confirmationStatus,
          confirmationError,
          currentStep
        )
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
          isLoading:
            LOADING_STATUS.includes(grantStatus) || index === loadingStep,
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
          message: getStepMessage(index, revokeStatus, error, currentStep),
          isLoading:
            LOADING_STATUS.includes(revokeStatus) || index === loadingStep,
          onActionClicked: handleRevokeToken,
          status: revokeStatus
        }
      }
      return step as Step & { status: AuthorizationStepStatus }
    })
  }, [
    authorizationType,
    requiredAllowance,
    currentAllowance,
    authorizedContract,
    network,
    action,
    grantStatus,
    revokeStatus,
    confirmationStatus,
    confirmationError,
    loadingStep,
    error,
    currentStep,
    handleGrantToken,
    handleRevokeToken,
    handleAuthorized
  ])

  console.log({ loadingStep })
  useEffect(() => {
    const currentStepData = steps[currentStep]
    console.log({ currentStepData, loadingStep, currentStep })
    if (currentStep === loadingStep) {
      if (currentStepData.status === AuthorizationStepStatus.DONE) {
        setCurrentStep(currentStep + 1)
      }

      if (
        [AuthorizationStepStatus.DONE, AuthorizationStepStatus.ERROR].includes(
          currentStepData.status
        )
      ) {
        setLoadingStep(undefined)
      }
    }
    // We only want to run this when there is a change in the current steps status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps[currentStep].status])

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
