export type Props<T> = {
  values: T[]
  currentValue?: T
  onMenuItemClick: (value: T) => void
}
