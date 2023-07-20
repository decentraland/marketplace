import { BUILDER_SERVER_URL, builderAPI } from './api'

describe('when getting the content url by a given hash', () => {
  const hash = 'aHash'

  it('should return the complete url', () => {
    expect(builderAPI.contentUrl(hash)).toBe(
      `${BUILDER_SERVER_URL}/storage/contents/${hash}`
    )
  })
})
