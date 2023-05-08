import { BigNumber, ethers } from 'ethers'
import {
  getAuthorizationFlowError,
  getError,
  getLoading
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  Authorization,
  AuthorizationAction,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import {
  AuthorizationError,
  areEqual,
  hasAuthorization,
  hasAuthorizationAndEnoughAllowance
} from 'decentraland-dapps/dist/modules/authorization/utils'
import { TransactionLink } from 'decentraland-dapps/dist/containers'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getType } from 'decentraland-dapps/dist/modules/loading/utils'
import { getTransactions } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { Network } from '@dcl/schemas'
import { RootState } from '../../../../modules/reducer'
import { Contract } from '../../../../modules/vendor/services'
import {
  AuthorizationStepAction,
  AuthorizationStepStatus
} from './AuthorizationModal.types'
import styles from './AuthorizationModal.module.css'
import {
  AUTHORIZATION_FLOW_REQUEST,
  GRANT_TOKEN_REQUEST,
  REVOKE_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'

export function getStepStatus(
  state: RootState,
  authorizationAction: AuthorizationAction,
  authorization: Authorization,
  allowance: BigNumber | undefined
): AuthorizationStepStatus {
  const actionType =
    authorizationAction === AuthorizationAction.REVOKE
      ? REVOKE_TOKEN_REQUEST
      : GRANT_TOKEN_REQUEST

  if (isLoadingType(getLoading(state), actionType)) {
    return AuthorizationStepStatus.WAITING
  }

  const pendingActionTypeTransactions = getTransactions(
    state,
    authorization.address
  ).filter(
    transaction =>
      isPending(transaction.status) &&
      getType({ type: actionType }) ===
        getType({ type: transaction.actionType }) &&
      areEqual(transaction.payload.authorization, authorization)
  )

  if (pendingActionTypeTransactions.length) {
    return AuthorizationStepStatus.PROCESSING
  }

  const error = getAuthorizationFlowError(state)

  if (error === AuthorizationError.INSUFFICIENT_ALLOWANCE) {
    return AuthorizationStepStatus.ALLOWANCE_AMOUNT_ERROR
  }

  if (error || getError(state)) {
    return AuthorizationStepStatus.ERROR
  }

  let isDone = false
  const authorizations = getAuthorizations(state)

  if (authorization.type === AuthorizationType.ALLOWANCE) {
    // If allowance is undefined, then the action is revoke
    if (!allowance) {
      isDone = !hasAuthorization(authorizations, authorization)
    } else {
      // grant action
      isDone = hasAuthorizationAndEnoughAllowance(
        authorizations,
        authorization,
        allowance.toString()
      )
    }
  } else {
    isDone = hasAuthorization(authorizations, authorization)
  }

  if (isDone) {
    return AuthorizationStepStatus.DONE
  }

  if (
    isLoadingType(getLoading(state), AUTHORIZATION_FLOW_REQUEST) &&
    getLoading(state).find(
      loadingAction =>
        loadingAction.payload?.authorizationAction === authorizationAction
    )
  ) {
    return AuthorizationStepStatus.LOADING_INFO
  }

  return AuthorizationStepStatus.PENDING
}

export function getStepError(error: string | null) {
  if (!error) {
    return undefined;
  }

  return error.length > 100 ? t('mana_authorization_modal.generic_error') : error
}

export function getStepMessage(
  stepIndex: number,
  stepStatus: AuthorizationStepStatus,
  error: string | null,
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
      return <div className={styles.error}>{getStepError(error)}</div>
    case AuthorizationStepStatus.ALLOWANCE_AMOUNT_ERROR:
      return (
        <div className={styles.error}>
          {t('mana_authorization_modal.spending_cap_error')}
        </div>
      )
    case AuthorizationStepStatus.DONE:
      return t('mana_authorization_modal.done')
    default:
      return undefined
  }
}

export function getSteps({
  authorizationType,
  network,
  requiredAllowance,
  contract,
  currentAllowance
}: {
  authorizationType: AuthorizationType
  network: Network
  requiredAllowance?: BigNumber
  currentAllowance?: BigNumber
  contract: Contract | null
}) {
  const requiredAllowanceAsEth = requiredAllowance
    ? ethers.utils.formatEther(requiredAllowance)
    : ''
  if (
    (!currentAllowance || !currentAllowance.isZero()) &&
    authorizationType === AuthorizationType.ALLOWANCE &&
    network === Network.ETHEREUM
  ) {
    return [
      {
        title: t('mana_authorization_modal.revoke_cap.title'),
        description: t('mana_authorization_modal.revoke_cap.description', {
          price: requiredAllowanceAsEth
        }),
        actionType: AuthorizationStepAction.REVOKE
      },
      {
        title: t('mana_authorization_modal.set_cap.title'),
        description: t('mana_authorization_modal.set_cap.description', {
          price: requiredAllowanceAsEth
        }),
        actionType: AuthorizationStepAction.GRANT
      }
    ]
  }

  if (authorizationType === AuthorizationType.ALLOWANCE) {
    return [
      {
        title: t('mana_authorization_modal.authorize_mana.title', {
          contract: () => (
            <TransactionLink
              address={contract?.address || ''}
              chainId={contract?.chainId}
              txHash=""
            >
              {contract?.label || contract?.name || ''}
            </TransactionLink>
          )
        }),
        description: t('mana_authorization_modal.authorize_mana.description', {
          price: requiredAllowanceAsEth
        }),
        actionType: AuthorizationStepAction.GRANT
      }
    ]
  }

  return [
    {
      title: t('mana_authorization_modal.authorize_nft.title', {
        contract: () => (
          <TransactionLink
            address={contract?.address || ''}
            chainId={contract?.chainId}
            txHash=""
          >
            {contract?.label || contract?.name || ''}
          </TransactionLink>
        )
      }),
      actionType: AuthorizationStepAction.GRANT
    }
  ]
}
