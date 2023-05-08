import { useCallback, useEffect, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Modal } from 'decentraland-ui'
import MultiStep from './MultiStep/MultiStep'
import {
  AuthorizationStepAction,
  AuthorizationStepStatus,
  Props
} from './AuthorizationModal.types'
import styles from './AuthorizationModal.module.css'
import { Step } from './MultiStep/MultiStep.types'
import { getStepMessage, getSteps } from './utils'
import { getContractByParams } from '../../../../modules/contract/utils'
import { AuthorizationAction } from 'decentraland-dapps/dist/modules/authorization/types'
import { Network } from '@dcl/schemas'

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
  contracts,
  onClose,
  onRevoke,
  onGrant,
  onAuthorized,
  onFetchAuthorizations
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState<AuthorizationStepAction>()

  useEffect(() => {
    onFetchAuthorizations()
  }, [onFetchAuthorizations])

  const handleRevokeToken = useCallback(() => {
    onRevoke()
    setLoading(AuthorizationStepAction.REVOKE)
  }, [onRevoke])

  const handleGrantToken = useCallback(() => {
    onGrant()
    setLoading(AuthorizationStepAction.GRANT)
  }, [onGrant])

  const handleAuthorized = useCallback(() => {
    onAuthorized()
    setLoading(AuthorizationStepAction.CONFIRM)
  }, [onAuthorized])

  const authorizedContract = getContractByParams(contracts, {
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
    return [
      ...authSteps,
      {
        title: t('mana_authorization_modal.confirm_transaction.title', {
          action: t(`mana_authorization_modal.${action}.action`)
        }),
        action: t('mana_authorization_modal.confirm_transaction.action'),
        status: confirmationStatus,
        actionType: AuthorizationStepAction.CONFIRM,
        error: confirmationError,
        onActionClicked: handleAuthorized
      }
    ]
      .map(step => {
        if (step.actionType === AuthorizationStepAction.GRANT) {
          if (
            grantStatus === AuthorizationStepStatus.ALLOWANCE_AMOUNT_ERROR &&
            network === Network.ETHEREUM
          ) {
            return {
              ...step,
              error: t(
                'mana_authorization_modal.insufficient_amount_error.message'
              ),
              action: 'Revoke',
              status: revokeStatus,
              message:
                revokeStatus === AuthorizationStepStatus.PENDING ? (
                  <div className={styles.error}>
                    {t(
                      'mana_authorization_modal.insufficient_amount_error.message'
                    )}
                  </div>
                ) : (
                  undefined
                ),
              actionType: AuthorizationAction.REVOKE,
              onActionClicked: handleRevokeToken
            }
          }

          return {
            ...step,
            action:
              grantStatus === AuthorizationStepStatus.DONE
                ? undefined
                : t('mana_authorization_modal.set_cap.action'),
            error,
            status: grantStatus,
            onActionClicked: handleGrantToken
          }
        }

        if (step.actionType === AuthorizationStepAction.REVOKE) {
          return {
            ...step,
            action:
              revokeStatus === AuthorizationStepStatus.DONE
                ? undefined
                : t('mana_authorization_modal.revoke_cap.action'),
            error,
            status: revokeStatus,
            onActionClicked: handleRevokeToken
          }
        }

        return step as Step & {
          error: string
          status: AuthorizationStepStatus
          actionType: AuthorizationStepAction
          message?: string
        }
      })
      .map((step, index) => {
        return {
          ...step,
          isLoading: index === currentStep && LOADING_STATUS.includes(step.status),
          message:
            'message' in step && step.message
              ? step.message
              : getStepMessage(index, step.status, step.error, currentStep),
          testId: `${step.actionType}-step`
        }
      })
  }, [
    grantStatus,
    revokeStatus,
    authorizationType,
    requiredAllowance,
    currentAllowance,
    network,
    action,
    confirmationStatus,
    confirmationError,
    authorizedContract,
    currentStep,
    error,
    handleGrantToken,
    handleRevokeToken,
    handleAuthorized
  ])

  useEffect(() => {
    const currentStepData = steps[currentStep]

    if (
      currentStepData.status === AuthorizationStepStatus.DONE &&
      currentStepData.actionType === loading
    ) {
      setCurrentStep(currentStep + 1)
      setLoading(undefined)
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
