export type Props = {
  name: string
  values: string[]
  options: { value: string; text: string }[]
  onChange: (newValues: string[]) => void
}
