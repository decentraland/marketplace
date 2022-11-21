export type Props = {
  name: string
  value: string
  clearable?: boolean
  options: { value: string; text: string }[]
  onChange: (newValue: string) => void
  disabled?: boolean
}
