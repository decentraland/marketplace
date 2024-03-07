import { waitFor } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { renderWithProviders } from '../../../utils/test'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import { Props } from './SmartWearableVideoShowcaseModal.types'
import SmartWearableVideoShowcaseModal from './SmartWearableVideoShowcaseModal'
import { VIDEO_TEST_ID } from './constants'

jest.mock('../../../lib/asset')

// To avoid 'unstable_flushDiscreteUpdates' error when rendering the video
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  set: () => {}
})

let videoHash: string

function renderSmartWearableVideoShowcaseModal(props: Partial<Props> = {}) {
  return renderWithProviders(
    <SmartWearableVideoShowcaseModal
      name="SmartWearableVideoShowcaseModal"
      metadata={{ videoHash }}
      onClose={jest.fn()}
      {...props}
    />
  )
}

describe('when the modal is rendered', () => {
  let renderedModal: ReturnType<typeof renderSmartWearableVideoShowcaseModal>

  beforeEach(() => {
    videoHash = 'videoHash'
    renderedModal = renderSmartWearableVideoShowcaseModal()
  })

  it('should render the title and share buttons', () => {
    const { getByText } = renderedModal
    expect(
      getByText(t('smart_wearable_video_showcase_modal.title'))
    ).toBeInTheDocument()
  })

  it('should render the video with the src taken from the props', async () => {
    const { getByTestId } = renderedModal
    const video = getByTestId(VIDEO_TEST_ID) as HTMLVideoElement

    await waitFor(() => {
      expect(getByTestId(VIDEO_TEST_ID)).toBeInTheDocument()
      expect(video.src).toBe(builderAPI.contentUrl('videoHash'))
    })
  })
})
