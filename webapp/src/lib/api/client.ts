import ApolloClient from 'apollo-boost'

export const MAX_QUERY_SIZE = 1000
export const PAGE_SIZE = 24
export const MARKETPLACE_URL = process.env.REACT_APP_MARKETPLACE_URL

export const client = new ApolloClient({
  uri: MARKETPLACE_URL
})
