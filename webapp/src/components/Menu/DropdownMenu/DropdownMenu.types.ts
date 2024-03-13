export type Props<T extends string | number> = {
  values: T[]
  currentValue?: T
  onMenuItemClick: (value: T) => void
}
