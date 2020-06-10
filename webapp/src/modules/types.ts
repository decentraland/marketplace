export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown
}
  ? U
  : T

export type AwaitFn<T extends (...args: any) => any> = Await<ReturnType<T>>
