import { IPreviewController } from '@dcl/schemas'
import { setWearablePreviewController, setEmotePlaying } from './actions'
import { previewReducer, INITIAL_STATE, PreviewState } from './reducer'

let state: PreviewState

beforeEach(() => {
  state = { ...INITIAL_STATE }
})

describe('when reducing action of setting the wearable preview', () => {
  it('should return a state with the created wearable preview', () => {
    const controller = { scene: {}, emote: {} } as IPreviewController
    expect(
      previewReducer(state, setWearablePreviewController(controller))
    ).toEqual({
      ...INITIAL_STATE,
      wearablePreviewController: controller
    })
  })
})

describe('when reducing action of setting the wearable preview to null', () => {
  it('should return a state with the unloaded wearable preview', () => {
    expect(previewReducer(state, setWearablePreviewController(null))).toEqual({
      ...INITIAL_STATE,
      wearablePreviewController: null
    })
  })
})

describe('when reducing action of setting the playing emote state to true', () => {
  it('should return a state with the playing emote state true', () => {
    expect(previewReducer(state, setEmotePlaying(true))).toEqual({
      ...INITIAL_STATE,
      isPlayingEmote: true
    })
  })
})

describe('when reducing action of setting the playing emote state to false', () => {
  it('should return a state with the playing emote state false', () => {
    expect(previewReducer(state, setEmotePlaying(false))).toEqual({
      ...INITIAL_STATE,
      isPlayingEmote: false
    })
  })
})
