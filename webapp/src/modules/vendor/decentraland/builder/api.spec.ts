import { BUILDER_SERVER_URL, builderAPI } from './api'

describe('when getting the content url by a given hash', () => {
  const hash = 'aHash'

  it('should return the complete url', () => {
    expect(builderAPI.contentUrl(hash)).toBe(`${BUILDER_SERVER_URL}/storage/contents/${hash}`)
  })
})

describe('when getting the url for collections published and using a search term', () => {
  const searchTerm = 'aSearchTerm'
  const limit = 5

  it('should return the url', () => {
    expect(builderAPI.publishedCollectionURL(searchTerm, limit)).toBe(
      `/collections?is_published=true&status=approved&q=${searchTerm}&limit=${limit}`
    )
  })
})
