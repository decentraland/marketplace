import { createBrowserHistory, Location } from 'history'

export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown
}
  ? U
  : T

export type AwaitFn<T extends (...args: any) => any> = Await<ReturnType<T>>

export interface ExtendedHistory extends ReturnType<typeof createBrowserHistory> {
  getLastVisitedLocations: (n?: number) => Location[]
}
