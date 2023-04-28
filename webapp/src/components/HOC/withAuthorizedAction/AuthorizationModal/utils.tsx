import { BigNumber, ethers } from 'ethers'
import {
  getError,
  getLoading
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  Authorization,
  AuthorizationType,
  AuthorizationAction
} from 'decentraland-dapps/dist/modules/authorization/types'
import {
  areEqual,
  hasAuthorization,
  hasAuthorizationAndEnoughAllowance
} from 'decentraland-dapps/dist/modules/authorization/utils'
import { TransactionLink } from 'decentraland-dapps/dist/containers'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getType } from 'decentraland-dapps/dist/modules/loading/utils'
import { getPendingTransactions } from 'decentraland-dapps/dist/modules/transaction/selectors'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  getData as getAuthorizations,
  getLoading as getLoadingAuthorizations
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { Network } from '@dcl/schemas'
import { RootState } from '../../../../modules/reducer'
import { Contract } from '../../../../modules/vendor/services'
import { AuthorizationStepStatus } from './AuthorizationModal.types'
import styles from './AuthorizationModal.module.css'

export function getStepStatus(
  state: RootState,
  actionType: string,
  authorization: Authorization,
  allowance?: BigNumber
): AuthorizationStepStatus {
  if (isLoadingType(getLoadingAuthorizations(state), FETCH_AUTHORIZATIONS_REQUEST)) {
    return AuthorizationStepStatus.LOADING_INFO
  }

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
        authorizationAction: AuthorizationAction.REVOKE,
        testId: 'revoke-action-step'
      },
      {
        title: t('mana_authorization_modal.set_cap.title'),
        description: t('mana_authorization_modal.set_cap.description', {
          price: requiredAllowanceAsEth
        }),
        authorizationAction: AuthorizationAction.GRANT,
        testId: 'grant-action-step'
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
        authorizationAction: AuthorizationAction.GRANT,
        testId: 'grant-action-step'
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
      authorizationAction: AuthorizationAction.GRANT,
      testId: 'grant-action-step'
    }
  ]
}
