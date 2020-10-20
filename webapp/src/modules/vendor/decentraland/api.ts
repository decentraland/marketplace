import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const MARKETPLACE_API_URL = process.env.REACT_APP_MARKETPLACE_API_URL
const COLLECTIONS_API_URL = process.env.REACT_APP_COLLECTIONS_API_URL

export const MAX_QUERY_SIZE = 1000

export const marketplaceClient = createClient(MARKETPLACE_API_URL)
export const collectionsClient = createClient(COLLECTIONS_API_URL)

function createClient(uri: HttpLink.Options['uri']) {
  return new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      }
    }
  })
}
