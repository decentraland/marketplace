import { Item } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../../utils/test'
import { Props } from './SmartWearableVideoShowcaseModal.types'
import SmartWearableVideoShowcaseModal from './SmartWearableVideoShowcaseModal'
import { VIDEO_TEST_ID } from './constants'

let item: Item = {
  id: 'aListId'
} as Item

function renderSmartWearableVideoShowcaseModal(props: Partial<Props> = {}) {
  return renderWithProviders(
    <SmartWearableVideoShowcaseModal
      name="SmartWearableVideoShowcaseModal"
      metadata={{
        item
      }}
      onClose={jest.fn()}
      {...props}
    />
  )
}

describe('when the modal is rendered', () => {
  let renderedModal: ReturnType<typeof renderSmartWearableVideoShowcaseModal>

  beforeEach(() => {
    renderedModal = renderSmartWearableVideoShowcaseModal()
  })

  it('should render the title and share buttons', () => {
    const { getByText } = renderedModal
    expect(
      getByText(t('smart_wearable_video_showcase_modal.title'))
    ).toBeInTheDocument()
  })

  it('should render the video', () => {
    const { getByTestId } = renderedModal
    expect(getByTestId(VIDEO_TEST_ID)).toBeInTheDocument()
  })
})
