import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthorizationModal } from './AuthorizationModal'
import { AuthorizationAction, Props } from './AuthorizationModal.types'

jest.mock('decentraland-dapps/dist/containers', () => ({
  TransactionLink: () => 'test'
}))

function renderAuthorizationModal(props: Partial<Props>) {
  return render(
    <AuthorizationModal
      authorization={{} as Authorization}
      requiredAllowance={'10'}
      shouldAuthorize={false}
      shouldUpdateAllowance={false}
      action={AuthorizationAction.BUY}
      onClose={jest.fn()}
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

describe('when shouldAuthorized is true', () => {
  it('should render two steps', () => {
    const screen = renderAuthorizationModal({ shouldAuthorize: true })
    expect(screen.getByTestId('multi-step').children.length).toBe(2)
  })

  it('should render authorization step', () => {
    const screen = renderAuthorizationModal({ shouldAuthorize: true })
    expect(
      screen.getByRole('button', {
        name: t('mana_authorization_modal.authorize.action')
      })
    ).toBeInTheDocument()
  })

  it('should render confirm action step', () => {
    const screen = renderAuthorizationModal({ shouldAuthorize: true })
    expect(
      screen.getByRole('button', {
        name: t('mana_authorization_modal.confirm_transaction.action')
      })
    ).toBeInTheDocument()
  })

  it('should show only first step enabled', () => {
    const screen = renderAuthorizationModal({ shouldAuthorize: true })
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

describe('when shouldUpdateAllowance is true', () => {
  it('should render two steps', () => {
    const screen = renderAuthorizationModal({ shouldUpdateAllowance: true })
    expect(screen.getByTestId('multi-step').children.length).toBe(3)
  })

  it('should render revoke current cap step', () => {
    const screen = renderAuthorizationModal({ shouldUpdateAllowance: true })
    expect(
      screen.getByText(t('mana_authorization_modal.revoke_cap.title'))
    ).toBeInTheDocument()
  })

  it('should render set new cap step', () => {
    const screen = renderAuthorizationModal({ shouldUpdateAllowance: true })
    expect(
      screen.getByText(t('mana_authorization_modal.set_cap.title'))
    ).toBeInTheDocument()
  })

  it('should render confirm transaction step', () => {
    const screen = renderAuthorizationModal({ shouldUpdateAllowance: true })
    expect(
      screen.getByRole('button', {
        name: t('mana_authorization_modal.confirm_transaction.action')
      })
    ).toBeInTheDocument()
  })

  it('should show only first step enabled', () => {
    const screen = renderAuthorizationModal({ shouldUpdateAllowance: true })
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
