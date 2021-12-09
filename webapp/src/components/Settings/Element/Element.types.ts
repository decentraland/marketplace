export type Props = {
  title: string
  input: string
  inputType: 'input' | 'textarea'
  onChange: (newValue: string) => void
}
