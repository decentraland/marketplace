import { fireEvent } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { List } from '../../../modules/favorites/types'
import { renderWithProviders } from '../../../utils/test'
import CreateOrEditListModal, {
  CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID,
  CREATE_OR_EDIT_LIST_CANCEL_BUTTON_DATA_TEST_ID,
  CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID,
  CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID,
  CREATE_OR_EDIT_LIST_PRIVATE_DATA_TEST_ID
} from './CreateOrEditListModal'
import { Props } from './CreateOrEditListModal.types'

function renderCreateListModal(props: Partial<Props> = {}) {
  return renderWithProviders(
    <CreateOrEditListModal
      name="CreateListModal"
      onClose={jest.fn()}
      isLoading={false}
      error={null}
      onEditList={jest.fn()}
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
    // Write something into the field so the accept button doesn't get disabled
    fireEvent.change(renderedModal.getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0], {
      target: { value: 'aValue' }
    })
  })

  it('should render the name input as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0]).toHaveAttribute('disabled')
  })

  it('should render the description input as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID)).toHaveAttribute('disabled')
  })

  it('should render the checkbox input as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_PRIVATE_DATA_TEST_ID).children[0]).toHaveAttribute('disabled')
  })

  it('should render the accept button as disabled and loading', () => {
    const { getByTestId } = renderedModal
    const acceptButton = getByTestId(CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID)

    expect(acceptButton).toHaveAttribute('disabled')
    expect(acceptButton).toHaveClass('loading')
  })

  it('should render the cancel button as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_CANCEL_BUTTON_DATA_TEST_ID)).toHaveAttribute('disabled')
  })
})

describe('when the create list procedure is not loading', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>

  beforeEach(() => {
    renderedModal = renderCreateListModal({ isLoading: false })
    // Write something into the field so the accept button doesn't get disabled
    fireEvent.change(renderedModal.getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0], {
      target: { value: 'aValue' }
    })
  })

  it('should render the name input as not disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0]).not.toHaveAttribute('disabled')
  })

  it('should render the description input as not disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID)).not.toHaveAttribute('disabled')
  })

  it('should render the checkbox input as not disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_PRIVATE_DATA_TEST_ID).children[0]).not.toHaveAttribute('disabled')
  })

  it('should render the accept button as not disabled nor loading', () => {
    const { getByTestId } = renderedModal
    const acceptButton = getByTestId(CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID)

    expect(acceptButton).not.toHaveClass('loading')
    expect(acceptButton).not.toHaveAttribute('disabled')
  })

  it('should render the cancel button as not disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_CANCEL_BUTTON_DATA_TEST_ID)).not.toHaveAttribute('disabled')
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
    fireEvent.click(getByTestId(CREATE_OR_EDIT_LIST_CANCEL_BUTTON_DATA_TEST_ID))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('when clicking the accept button', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>
  let onCreateList: jest.Mock
  let onEditList: jest.Mock
  let name: string
  let description: string

  beforeEach(() => {
    name = 'aName'
    description = 'aDescription'
    onCreateList = jest.fn()
    onEditList = jest.fn()
  })

  describe("and there's a list that is being edited", () => {
    let list: List

    beforeEach(() => {
      list = {
        id: 'anId',
        name: 'aName',
        description: 'aDescription',
        itemsCount: 1,
        isPrivate: true
      }
      renderedModal = renderCreateListModal({
        onCreateList,
        onEditList,
        metadata: { list }
      })
      const { getByTestId } = renderedModal
      fireEvent.change(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0], {
        target: { value: 'anotherListName' }
      })
      fireEvent.click(getByTestId(CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID))
    })

    it('should call the onEditList prop function with the input values', () => {
      expect(onEditList).toHaveBeenCalledWith(list.id, {
        name: 'anotherListName',
        description: list.description,
        isPrivate: list.isPrivate
      })
    })
  })

  describe('and the list is being created', () => {
    beforeEach(() => {
      renderedModal = renderCreateListModal({ onCreateList, onEditList })
      const { getByTestId } = renderedModal
      fireEvent.change(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0], {
        target: { value: name }
      })
      fireEvent.change(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID), {
        target: { value: description }
      })
      fireEvent.click(getByTestId(CREATE_OR_EDIT_LIST_PRIVATE_DATA_TEST_ID).children[0])
      fireEvent.click(getByTestId(CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID))
    })

    it('should call the onCreateList prop function with the input values', () => {
      expect(onCreateList).toHaveBeenCalledWith({
        name,
        description,
        isPrivate: true
      })
    })
  })
})

describe('when the name input is empty', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>

  beforeEach(() => {
    renderedModal = renderCreateListModal()
  })

  it('should render the accept button as disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID)).toHaveAttribute('disabled')
  })
})

describe('when the name input is focused', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>

  beforeEach(() => {
    renderedModal = renderCreateListModal()
  })

  it('should render the max length info message', () => {
    const { getByTestId } = renderedModal
    fireEvent.focusIn(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0])
    expect(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).nextSibling).toHaveTextContent('List names can contain up to 32 characters')
  })
})

describe('when the name input is blurred', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>

  beforeEach(() => {
    renderedModal = renderCreateListModal()
  })

  it('should not render the max length info message', () => {
    const { getByTestId } = renderedModal
    fireEvent.focusIn(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0])
    fireEvent.focusOut(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0])
    expect(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).nextSibling).not.toHaveTextContent(
      'List names can contain up to 32 characters'
    )
  })
})

describe('when the description input is focused', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>

  beforeEach(() => {
    renderedModal = renderCreateListModal()
  })

  it('should render the max length info message', () => {
    const { getByTestId } = renderedModal
    fireEvent.focusIn(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID))
    expect(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID).nextSibling).toHaveTextContent(
      'List descriptions can contain up to 100 characters'
    )
  })
})

describe('when the description input is blurred', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>

  beforeEach(() => {
    renderedModal = renderCreateListModal()
  })

  it('should not render the max length info message', () => {
    const { getByTestId } = renderedModal
    fireEvent.focusIn(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID))
    fireEvent.focusOut(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID))
    expect(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID).nextSibling).not.toHaveTextContent(
      'List descriptions can contain up to 100 characters'
    )
  })
})

describe('when error is a duplicated name error', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>
  let error: string

  beforeEach(() => {
    error = 'There is already a list with the same name'
    renderedModal = renderCreateListModal({ error })
  })

  it('should render the name input with an error message', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).nextSibling).toHaveTextContent(
      'This name is already in use for another of your lists. Choose a different name.'
    )
  })
})

describe('when the list name is not set', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>
  beforeEach(() => {
    renderedModal = renderCreateListModal()
  })

  it('should render the accept button disabled', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID)).toHaveAttribute('disabled')
  })
})

describe('when the component is rendered with a list', () => {
  let renderedModal: ReturnType<typeof renderCreateListModal>
  let list: List

  beforeEach(() => {
    list = {
      id: 'anId',
      name: 'aName',
      description: 'aDescription',
      itemsCount: 1,
      isPrivate: true
    }
    renderedModal = renderCreateListModal({
      metadata: {
        list
      }
    })
  })

  it('should populate the name input with the list name', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID).children[0]).toHaveValue(list.name)
  })

  it('should populate the description input with the list description', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID)).toHaveTextContent(list.description ?? '')
  })

  it('should populate the checkbox input with the list isPrivate value', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_PRIVATE_DATA_TEST_ID).children[0]).toHaveAttribute('checked')
  })

  it('should render the confirm button as "Save"', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID)).toHaveTextContent('Save')
  })

  it('should render the checkbox label with the edit message', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_PRIVATE_DATA_TEST_ID)).toHaveTextContent(t('create_or_edit_list_modal.edit.private'))
  })

  it("should render the accept button disabled as the list's properties didn't change", () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID)).toHaveAttribute('disabled')
  })
})
