import { clearBidError } from "./actions"
import { bidReducer, INITIAL_STATE } from "./reducer"

describe("when clear bid error action is received", () => {
  it("should set error field as null", () => {
    const stateWithError = {
      ...INITIAL_STATE,
      error: 'Some test error'
    }
    expect(bidReducer(stateWithError, clearBidError())).toEqual(expect.objectContaining({ error: null }))
  })
})
