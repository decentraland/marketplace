import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const MARKETPLACE_URL = process.env.REACT_APP_MARKETPLACE_URL
export const MAX_QUERY_SIZE = 1000

const link = new HttpLink({
  uri: MARKETPLACE_URL
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
