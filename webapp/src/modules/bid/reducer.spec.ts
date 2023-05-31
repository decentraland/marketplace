import { clearBidError } from "./actions"
import { bidReducer, BidState, INITIAL_STATE } from "./reducer"

let state: BidState

beforeEach(() => {
  state = INITIAL_STATE
})

describe("when clear bid error action is received", () => {
  beforeEach(() => {
    state.error = 'Some test error'
  })

  it("should set error field as null", () => {
    expect(bidReducer(state, clearBidError())).toEqual(expect.objectContaining({ error: null }))
  })
})
