export type Props = {
  type: 'input' | 'textarea'
  value: string
  onChange: (newValue: string) => void
}
