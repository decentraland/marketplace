import ApolloClient from 'apollo-boost'

export const MARKETPLACE_URL = process.env.REACT_APP_MARKETPLACE_URL

export const client = new ApolloClient({
  uri: MARKETPLACE_URL
})
