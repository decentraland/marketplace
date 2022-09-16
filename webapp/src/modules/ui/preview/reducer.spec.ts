import { IPreviewController } from '@dcl/schemas'
import { setWearablePreviewController, setEmotePlaying } from './actions'
import { previewReducer, INITIAL_STATE, PreviewState } from './reducer'

let state: PreviewState

beforeEach(() => {
  state = { ...INITIAL_STATE }
})

describe('when reducing the successful action of setting the wearable preview', () => {
  const controller = {} as IPreviewController

  it('should return a state with the created wearable preview', () => {
    expect(
      previewReducer(state, setWearablePreviewController(controller))
    ).toEqual({
      ...INITIAL_STATE,
      wearablePreviewController: controller
    })
  })

  it('should return a state with the unloaded wearable preview', () => {
    expect(previewReducer(state, setWearablePreviewController(null))).toEqual({
      ...INITIAL_STATE,
      wearablePreviewController: null
    })
  })
})

describe('when reducing the successful action of setting the playing emote state', () => {
  it('should return a state with the setting the playing emote state play', () => {
    expect(previewReducer(state, setEmotePlaying(true))).toEqual({
      ...INITIAL_STATE,
      isPlayingEmote: true
    })
  })

  it('should return a state with the setting the playing emote state stop', () => {
    expect(previewReducer(state, setEmotePlaying(false))).toEqual({
      ...INITIAL_STATE,
      isPlayingEmote: false
    })
  })
})
