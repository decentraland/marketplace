import {
  getError,
  getLoading
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { Authorization, AuthorizationType, AuthorizationAction } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  areEqual,
  hasAuthorization,
  hasAuthorizationAndEnoughAllowance
} from 'decentraland-dapps/dist/modules/authorization/utils'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getType } from 'decentraland-dapps/dist/modules/loading/utils'
import { getPendingTransactions } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { RootState } from '../../../../modules/reducer'
import {
  AuthorizationStepStatus,
  AuthorizedAction
} from './AuthorizationModal.types'
import styles from './AuthorizationModal.module.css'
import { TransactionLink } from 'decentraland-dapps/dist/containers'

export function getStepStatus(
  state: RootState,
  actionType: string,
  authorization: Authorization,
  authorizations: Authorization[],
  allowance: string | null
): AuthorizationStepStatus {
  if (isLoadingType(getLoading(state), actionType)) {
    return AuthorizationStepStatus.WAITING
  }

  const pendingActionTypeTransactions = getPendingTransactions(
    state,
    authorization.address
  ).filter(
    transaction =>
      isPending(transaction.status) &&
      getType({ type: actionType }) ===
        getType({ type: transaction.actionType })
  )
  if (
    pendingActionTypeTransactions.some(({ payload }) =>
      areEqual(payload.authorization, authorization)
    )
  ) {
    return AuthorizationStepStatus.PROCESSING
  }

  if (getError(state)) {
    return AuthorizationStepStatus.ERROR
  }

  const isStepDone =
    allowance === null
      ? !hasAuthorization(authorizations, authorization)
      : hasAuthorizationAndEnoughAllowance(
          authorizations,
          authorization,
          allowance
        )

  if (isStepDone) {
    return AuthorizationStepStatus.DONE
  }

  return AuthorizationStepStatus.PENDING
}

export function getStepMessage(
  stepIndex: number,
  stepStatus: AuthorizationStepStatus,
  error: string,
  currentStep: number
) {
  if (stepIndex > currentStep) {
    return ''
  }

  if (stepIndex < currentStep) {
    return t('mana_authorization_modal.done')
  }

  switch (stepStatus) {
    case AuthorizationStepStatus.WAITING:
      return t('mana_authorization_modal.waiting_wallet')
    case AuthorizationStepStatus.PROCESSING:
      return t('mana_authorization_modal.waiting_confirmation')
    case AuthorizationStepStatus.ERROR:
      return <div className={styles.error}>{error}</div>
    case AuthorizationStepStatus.DONE:
      return t('mana_authorization_modal.done')
    default:
      return undefined
  }
}

export function getSteps(
  authorizationType: AuthorizationType,
  authorization: Authorization,
  authorizedAction: AuthorizedAction,
  requiredAllowance: string
) {
  if (authorizationType === AuthorizationType.APPROVAL) {
    return [
      {
        title: t('mana_authorization_modal.authorize.title', {
          contract: () => (
            <TransactionLink
              address={authorization.authorizedAddress}
              chainId={authorization.chainId}
              txHash=""
            >
              {t(`mana_authorization_modal.${authorizedAction}.contract`)}
            </TransactionLink>
          )
        }),
        description: t('mana_authorization_modal.authorize.description', {
          price: requiredAllowance
        }),
        authorizationAction: AuthorizationAction.GRANT,
        testId: "grant-action-step"
      }
    ]
  }

  return [
    {
      title: t('mana_authorization_modal.revoke_cap.title'),
      description: t('mana_authorization_modal.revoke_cap.description', {
        price: requiredAllowance
      }),
      authorizationAction: AuthorizationAction.REVOKE,
      testId: "revoke-action-step"
    },
    {
      title: t('mana_authorization_modal.set_cap.title'),
      description: t('mana_authorization_modal.set_cap.description', {
        price: requiredAllowance
      }),
      authorizationAction: AuthorizationAction.GRANT,
      testId: "grant-action-step"
    }
  ]
}
