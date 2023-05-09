import { useCallback, useEffect, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Modal } from 'decentraland-ui'
import { AuthorizationAction } from 'decentraland-dapps/dist/modules/authorization/types'
import { Network } from '@dcl/schemas'
import { getContractByParams } from '../../../../modules/contract/utils'
import MultiStep from './MultiStep/MultiStep'
import {
  AuthorizationStepAction,
  AuthorizationStepStatus,
  Props
} from './AuthorizationModal.types'
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
  contracts,
  onClose,
  onRevoke,
  onGrant,
  onAuthorized,
  onFetchAuthorizations
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState<AuthorizationStepAction>()
  const [shouldReauthorize, setShouldReauthorize] = useState(false)

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
            shouldReauthorize ||
            (grantStatus === AuthorizationStepStatus.ALLOWANCE_AMOUNT_ERROR &&
              network === Network.ETHEREUM)
          ) {
            return {
              ...step,
              error: t('mana_authorization_modal.insufficient_amount_error.message'),
              action: 'Revoke',
              status: revokeStatus,
              message:
                revokeStatus === AuthorizationStepStatus.PENDING || revokeStatus === AuthorizationStepStatus.DONE ? (
                  <div className={styles.error}>
                    {t(
                      'mana_authorization_modal.insufficient_amount_error.message'
                    )}
                  </div>
                ) : (
                  undefined
                ),
              actionType: AuthorizationAction.REVOKE,
              testId: 'reauthorize-step',
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
          isLoading:
            index === currentStep && LOADING_STATUS.includes(step.status),
          message:
            'message' in step && step.message
              ? step.message
              : getStepMessage(index, step.status, step.error, currentStep),
          testId: step.testId || `${step.actionType}-step`
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
    shouldReauthorize,
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
      if (shouldReauthorize) {
        setShouldReauthorize(false)
      } else {
        setCurrentStep(currentStep + 1)
        setLoading(undefined)
      }
    }
    // We only want to run this when there is a change in the current steps status
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps[currentStep].status])

  useEffect(() => {
    if (
      grantStatus === AuthorizationStepStatus.ALLOWANCE_AMOUNT_ERROR &&
      network === Network.ETHEREUM
    ) {
      setShouldReauthorize(true)
    }
  }, [grantStatus, network, setShouldReauthorize])

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
