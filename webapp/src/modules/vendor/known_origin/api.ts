import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { config } from '../../../config'

export const API_URL = config.get('KNOWN_ORIGIN_API_URL')
export const MAX_QUERY_SIZE = 1000

const link = new HttpLink({
  uri: API_URL
})

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache'
    }
  }
})
