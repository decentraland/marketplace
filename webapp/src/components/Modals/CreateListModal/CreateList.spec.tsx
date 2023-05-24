import { renderWithProviders } from '../../../utils/test'
import { Props } from './CreateListModal.types'
import CreateListModal from './CreateListModal'
import { fireEvent } from '@testing-library/react'

function renderCreateListModal(props: Partial<Props> = {}) {
  return renderWithProviders(
    <CreateListModal
      name="CreateListModal"
      onClose={jest.fn()}
      isLoading={false}
      error={null}
      onCreateList={jest.fn()}
      {...props}
    />,
    {
      preloadedState: {
        modal: {}
      }
    }
  )
}

describe('when the create list procedure is loading', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>
  beforeEach(() => {
    renderedModal = renderCreateListModal({ isLoading: true })
  })

  it('should render the name input as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-name').children[0]).toHaveAttribute(
      'disabled'
    )
  })

  it('should render the name input as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-name').children[0]).toHaveAttribute(
      'disabled'
    )
  })

  it('should render the checkbox input as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-private').children[0]).toHaveAttribute(
      'disabled'
    )
  })

  it('should render the accept button as disabled and loading', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-accept-button')).toHaveAttribute('disabled')
    expect(getByTestId('create-list-accept-button')).toHaveClass('loading')
  })

  it('should render the cancel button as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-cancel-button')).toHaveAttribute('disabled')
  })
})

describe('when the create list procedure is not loading', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>
  beforeEach(() => {
    renderedModal = renderCreateListModal({ isLoading: false })
  })

  it('should render the name input as not disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-name').children[0]).not.toHaveAttribute(
      'disabled'
    )
  })

  it('should render the name input as not disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-name').children[0]).not.toHaveAttribute(
      'disabled'
    )
  })

  it('should render the checkbox input as not disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-private').children[0]).not.toHaveAttribute(
      'disabled'
    )
  })

  it('should render the accept button as not disabled nor loading', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-accept-button')).not.toHaveClass('loading')
    expect(getByTestId('create-list-accept-button')).not.toHaveAttribute(
      'disabled'
    )
  })

  it('should render the cancel button as not disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId('create-list-cancel-button')).not.toHaveAttribute(
      'disabled'
    )
  })
})

describe('when clicking the cancel button', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>
  let onClose: jest.Mock

  beforeEach(() => {
    onClose = jest.fn()
    renderedModal = renderCreateListModal({ onClose })
  })

  it('should call the onClose prop function', () => {
    const { getByTestId } = renderedModal
    fireEvent.click(getByTestId('create-list-cancel-button'))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('when clicking the accept button', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>
  let onCreateList: jest.Mock
  let name: string
  let description: string

  beforeEach(() => {
    name = 'aName'
    description = 'aDescription'
    onCreateList = jest.fn()
    renderedModal = renderCreateListModal({ onCreateList })
  })

  it('should call the onCreateList prop function with the input values', () => {
    const { getByTestId } = renderedModal
    fireEvent.change(getByTestId('create-list-name').children[0], {
      target: { value: name }
    })
    fireEvent.change(getByTestId('create-list-description'), {
      target: { value: description }
    })
    fireEvent.click(getByTestId('create-list-private').children[0])
    fireEvent.click(getByTestId('create-list-accept-button'))

    expect(onCreateList).toHaveBeenCalledWith({
      name,
      description,
      isPrivate: true
    })
  })
})
