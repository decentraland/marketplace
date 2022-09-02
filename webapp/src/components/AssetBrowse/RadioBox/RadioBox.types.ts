export type Option = {
  name: string
  value: any
  info?: string
}

export type Props = {
  header: string
  className?: string
  items: Option[]
  value: Option['value']
  onClick: (item: Option, index: number) => unknown
}
