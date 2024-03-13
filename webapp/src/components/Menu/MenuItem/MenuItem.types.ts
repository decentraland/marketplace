export type Props<T extends string | number = string> = {
  className?: string
  value: T
  currentValue?: T
  subtitle?: string
  image?: string
  nestedLevel?: number
  withCaret?: boolean
  onClick: (value: T) => void
}
