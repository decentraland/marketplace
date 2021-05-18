export type Props<T = string> = {
  className?: string
  value: T
  currentValue?: T
  subtitle?: string
  image?: string
  nestedLevel?: number
  withCaret?: boolean
  onClick: (value: T) => void
}
