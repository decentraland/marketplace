export type Props<T = string> = {
  className?: string
  value: T
  currentValue?: T
  image?: string
  isSub?: boolean
  withCaret?: boolean
  onClick: (value: T) => void
}
