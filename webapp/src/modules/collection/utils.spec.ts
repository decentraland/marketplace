import { getCollectionManagementUrl } from './utils'

describe('when getting the URL to manage a collection', () => {
  it("should point to the creators app's collections page with the contract address", () => {
    expect(getCollectionManagementUrl('0xcontract')).toMatch(/\/create\/collections\?contract=0xcontract$/)
  })
})
