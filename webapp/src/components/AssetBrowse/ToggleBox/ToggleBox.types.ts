export type Item = {
  title: string
  description: string
  active?: boolean
  icon?: React.ReactNode
  disabled?: boolean
  onClick: (item: Item, index: number) => unknown
}

export type Props = {
  header?: string
  direction?: 'row' | 'column'
  className?: string
  items: Item[]
}
