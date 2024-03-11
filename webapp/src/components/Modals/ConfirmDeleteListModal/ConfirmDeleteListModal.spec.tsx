import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/test'
import ConfirmDeleteListModal, { CANCEL_DATA_TEST_ID, CONFIRM_DATA_TEST_ID } from './ConfirmDeleteListModal'
import { Props } from './ConfirmDeleteListModal.types'

function renderConfirmListModal(props: Partial<Props> = {}) {
  return renderWithProviders(
    <ConfirmDeleteListModal
      name="ConfirmDeleteListModal"
      metadata={{
        list: {
          id: 'aListId',
          name: 'aListName',
          isPrivate: false,
          itemsCount: 0
        }
      }}
      isLoading={false}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
      {...props}
    />
  )
}

let renderedModal: ReturnType<typeof renderConfirmListModal>

describe('when the delete list procedure is loading', () => {
  beforeEach(() => {
    renderedModal = renderConfirmListModal({ isLoading: true })
  })

  it('should render the confirm button as disabled and loading', () => {
    const { getByTestId } = renderedModal
    const acceptButton = getByTestId(CONFIRM_DATA_TEST_ID)

    expect(acceptButton).toHaveAttribute('disabled')
    expect(acceptButton).toHaveClass('loading')
  })

  it('should render the cancel button as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CANCEL_DATA_TEST_ID)).toHaveAttribute('disabled')
  })
})

describe('when the confirm button is clicked', () => {
  let onConfirm: jest.Mock
  beforeEach(() => {
    onConfirm = jest.fn()
    renderedModal = renderConfirmListModal({ onConfirm })
    fireEvent.click(renderedModal.getByTestId(CONFIRM_DATA_TEST_ID))
  })

  it('should call the onConfirm callback', () => {
    expect(onConfirm).toHaveBeenCalled()
  })
})

describe('when the cancel button is clicked', () => {
  let onClose: jest.Mock
  beforeEach(() => {
    onClose = jest.fn()
    renderedModal = renderConfirmListModal({ onClose })
    fireEvent.click(renderedModal.getByTestId(CANCEL_DATA_TEST_ID))
  })

  it('should call the onConfirm callback', () => {
    expect(onClose).toHaveBeenCalled()
  })
})
