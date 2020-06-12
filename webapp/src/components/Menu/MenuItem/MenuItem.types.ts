export type Props<T = string> = {
  value: T
  currentValue?: T
  isSub?: boolean
  withCaret?: boolean
  onClick: (value: T) => void
}
