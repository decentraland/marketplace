export type Item = {
  title: string
  description: string
  onClick: (item: Item, index: number) => unknown
}

export type Props = {
  header: string
  items: Item[]
  active?: number
}
