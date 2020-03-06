export type Props = {
  name: string
  value: string
  options: { value: string; text: string }[]
  onChange: (newValue: string) => void
}
