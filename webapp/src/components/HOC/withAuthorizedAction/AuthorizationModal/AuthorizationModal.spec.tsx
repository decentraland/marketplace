import { Network } from '@dcl/schemas'
import { render, RenderResult, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { BigNumber } from 'ethers'
import { AuthorizationModal } from './AuthorizationModal'
import {
  AuthorizationStepStatus,
  AuthorizedAction,
  Props
} from './AuthorizationModal.types'

jest.mock('decentraland-dapps/dist/containers', () => ({
  TransactionLink: () => 'test'
}))

function renderAuthorizationModal(props: Partial<Props>) {
  return render(
    <AuthorizationModal
      authorization={{} as Authorization}
      requiredAllowance={BigNumber.from('10')}
      authorizationType={AuthorizationType.APPROVAL}
      grantStatus={AuthorizationStepStatus.PENDING}
      revokeStatus={AuthorizationStepStatus.PENDING}
      action={AuthorizedAction.BUY}
      onClose={jest.fn()}
      onRevoke={jest.fn()}
      onGrant={jest.fn()}
      onAuthorized={jest.fn()}
      network={Network.MATIC}
      getContract={jest.fn()}
      error={''}
      {...props}
    />
  )
}

describe('when clicking close button', () => {
  it('should call onClose action', async () => {
    const onCloseMock = jest.fn()
    const screen = renderAuthorizationModal({ onClose: onCloseMock })
    await userEvent.click(
      screen.getByRole('button', { name: t('global.close') })
    )
    expect(onCloseMock).toHaveBeenCalled()
  })
})

describe('when authorization type is APPROVAL', () => {
  let screen: RenderResult
  beforeEach(() => {
    screen = renderAuthorizationModal({
      authorizationType: AuthorizationType.APPROVAL
    })
  })

  it('should render two steps', () => {
    expect(screen.getByTestId('multi-step').children.length).toBe(2)
  })

  it('should render authorization step', () => {
    expect(
      screen.getByRole('button', {
        name: t('mana_authorization_modal.authorize.action')
      })
    ).toBeInTheDocument()
  })

  it('should render confirm action step', () => {
    expect(
      screen.getByRole('button', {
        name: t('mana_authorization_modal.confirm_transaction.action')
      })
    ).toBeInTheDocument()
  })

  it('should show only first step enabled', () => {
    expect(
      screen.getByRole('button', {
        name: t('mana_authorization_modal.authorize.action')
      })
    ).toBeEnabled()

    expect(
      screen.getByRole('button', {
        name: t('mana_authorization_modal.confirm_transaction.action')
      })
    ).toBeDisabled()
  })
})

describe('when authorization type is ALLOWANCE', () => {
  let screen: RenderResult
  describe('and revoke status is PENDING', () => {
    beforeEach(() => {
      screen = renderAuthorizationModal({
        authorizationType: AuthorizationType.ALLOWANCE
      })
    })

    it('should render three steps', () => {
      expect(screen.getByTestId('multi-step').children.length).toBe(3)
    })

    it('should render revoke current cap step', () => {
      expect(
        screen.getByText(t('mana_authorization_modal.revoke_cap.title'))
      ).toBeInTheDocument()
    })

    it('should render set new cap step', () => {
      expect(
        screen.getByText(t('mana_authorization_modal.set_cap.title'))
      ).toBeInTheDocument()
    })

    it('should render confirm transaction step', () => {
      expect(
        screen.getByRole('button', {
          name: t('mana_authorization_modal.confirm_transaction.action')
        })
      ).toBeInTheDocument()
    })

    it('should show only first step enabled', () => {
      expect(
        screen.getAllByRole('button', {
          name: t('mana_authorization_modal.authorize.action')
        })[0]
      ).toBeEnabled()

      expect(
        screen.getAllByRole('button', {
          name: t('mana_authorization_modal.authorize.action')
        })[1]
      ).toBeDisabled()

      expect(
        screen.getByRole('button', {
          name: t('mana_authorization_modal.confirm_transaction.action')
        })
      ).toBeDisabled()
    })
  })

  describe('and revoke status is WAITING', () => {
    beforeEach(() => {
      screen = renderAuthorizationModal({
        authorizationType: AuthorizationType.ALLOWANCE,
        revokeStatus: AuthorizationStepStatus.WAITING
      })
    })

    it('should show waiting wallet for approval message', () => {
      expect(
        screen.getByText(t('mana_authorization_modal.waiting_wallet'))
      ).toBeInTheDocument()
    })

    it('should show loading icon', () => {
      expect(screen.getByTestId('step-loader')).toBeInTheDocument()
    })

    it('should not show action button', () => {
      const revokeStep = screen.getByTestId('revoke-action-step')
      expect(
        within(revokeStep).queryByText(
          t('mana_authorization_modal.authorize.action')
        )
      ).not.toBeInTheDocument()
    })
  })

  describe('and revoke status is PROCESSING', () => {
    beforeEach(() => {
      screen = renderAuthorizationModal({
        authorizationType: AuthorizationType.ALLOWANCE,
        revokeStatus: AuthorizationStepStatus.PROCESSING
      })
    })

    it('should show waiting wallet for approval message', () => {
      expect(
        screen.getByText(t('mana_authorization_modal.waiting_confirmation'))
      ).toBeInTheDocument()
    })

    it('should show loading icon', () => {
      expect(screen.getByTestId('step-loader')).toBeInTheDocument()
    })

    it('should not show action button', () => {
      const revokeStep = screen.getByTestId('revoke-action-step')
      expect(
        within(revokeStep).queryByText(
          t('mana_authorization_modal.authorize.action')
        )
      ).not.toBeInTheDocument()
    })
  })

  describe('and revoke status is DONE', () => {
    beforeEach(() => {
      screen = renderAuthorizationModal({
        authorizationType: AuthorizationType.ALLOWANCE,
        revokeStatus: AuthorizationStepStatus.DONE
      })
    })

    it('should show waiting wallet for approval message', () => {
      expect(
        screen.getByText(t('mana_authorization_modal.done'))
      ).toBeInTheDocument()
    })

    it('should not show loading icon', () => {
      expect(screen.queryByTestId('step-loader')).not.toBeInTheDocument()
    })

    it('should not show action button', () => {
      const revokeStep = screen.getByTestId('revoke-action-step')
      expect(
        within(revokeStep).queryByText(
          t('mana_authorization_modal.authorize.action')
        )
      ).not.toBeInTheDocument()
    })

    it('should enable next step', () => {
      const grantStep = screen.getByTestId('grant-action-step')
      expect(
        within(grantStep).getByRole('button', {
          name: t('mana_authorization_modal.authorize.action')
        })
      ).toBeEnabled()
    })
  })

  describe('and grant status is WAITING', () => {
    let grantStatusStep: HTMLElement

    beforeEach(() => {
      screen = renderAuthorizationModal({
        authorizationType: AuthorizationType.ALLOWANCE,
        revokeStatus: AuthorizationStepStatus.DONE,
        grantStatus: AuthorizationStepStatus.WAITING
      })

      grantStatusStep = screen.getByTestId('grant-action-step')
    })

    it('should show waiting wallet for approval message', () => {
      expect(
        within(grantStatusStep).getByText(
          t('mana_authorization_modal.waiting_wallet')
        )
      ).toBeInTheDocument()
    })

    it('should show loading icon', () => {
      expect(
        within(grantStatusStep).getByTestId('step-loader')
      ).toBeInTheDocument()
    })

    it('should not show action button', () => {
      expect(
        within(grantStatusStep).queryByText(
          t('mana_authorization_modal.authorize.action')
        )
      ).not.toBeInTheDocument()
    })
  })

  describe('and grant status is PROCESSING', () => {
    let grantStatusStep: HTMLElement

    beforeEach(() => {
      screen = renderAuthorizationModal({
        authorizationType: AuthorizationType.ALLOWANCE,
        revokeStatus: AuthorizationStepStatus.DONE,
        grantStatus: AuthorizationStepStatus.PROCESSING
      })

      grantStatusStep = screen.getByTestId('grant-action-step')
    })

    it('should show waiting wallet for approval message', () => {
      expect(
        within(grantStatusStep).getByText(
          t('mana_authorization_modal.waiting_confirmation')
        )
      ).toBeInTheDocument()
    })

    it('should show loading icon', () => {
      expect(
        within(grantStatusStep).getByTestId('step-loader')
      ).toBeInTheDocument()
    })

    it('should not show action button', () => {
      expect(
        within(grantStatusStep).queryByText(
          t('mana_authorization_modal.authorize.action')
        )
      ).not.toBeInTheDocument()
    })
  })

  describe('and grant status is DONE', () => {
    let grantStatusStep: HTMLElement

    beforeEach(() => {
      screen = renderAuthorizationModal({
        authorizationType: AuthorizationType.ALLOWANCE,
        revokeStatus: AuthorizationStepStatus.DONE,
        grantStatus: AuthorizationStepStatus.DONE
      })

      grantStatusStep = screen.getByTestId('grant-action-step')
    })

    it('should show waiting wallet for approval message', () => {
      expect(
        within(grantStatusStep).getByText(t('mana_authorization_modal.done'))
      ).toBeInTheDocument()
    })

    it('should not show loading icon', () => {
      expect(
        within(grantStatusStep).queryByTestId('step-loader')
      ).not.toBeInTheDocument()
    })

    it('should not show action button', () => {
      expect(
        within(grantStatusStep).queryByText(
          t('mana_authorization_modal.authorize.action')
        )
      ).not.toBeInTheDocument()
    })

    it('should enable confirmation step', () => {
      const confirmationStep = screen.getByTestId('confirm-action-step')
      expect(
        within(confirmationStep).getByRole('button', {
          name: t('mana_authorization_modal.confirm_transaction.action')
        })
      ).toBeEnabled()
    })
  })
})

describe('when clicking revoke authorization button', () => {
  it('should call onRevoke callback', async () => {
    const onRevokeMock = jest.fn()
    const screen = renderAuthorizationModal({
      authorizationType: AuthorizationType.ALLOWANCE,
      revokeStatus: AuthorizationStepStatus.PENDING,
      onRevoke: onRevokeMock
    })
    const revokeStatusStep = screen.getByTestId('revoke-action-step')
    await userEvent.click(
      within(revokeStatusStep).getByRole('button', {
        name: t('mana_authorization_modal.revoke_cap.action')
      })
    )
    expect(onRevokeMock).toHaveBeenCalled()
  })
})

describe('when clicking grant authorization button', () => {
  it('should call onRevoke callback', async () => {
    const onGrantMock = jest.fn()
    const screen = renderAuthorizationModal({
      authorizationType: AuthorizationType.ALLOWANCE,
      revokeStatus: AuthorizationStepStatus.DONE,
      grantStatus: AuthorizationStepStatus.PENDING,
      onGrant: onGrantMock
    })
    const grantStatusStep = screen.getByTestId('grant-action-step')
    await userEvent.click(
      within(grantStatusStep).getByRole('button', {
        name: t('mana_authorization_modal.set_cap.action')
      })
    )
    expect(onGrantMock).toHaveBeenCalled()
  })
})
