export type Props = {
  name: string
  values: string[]
  options: { value: string; label: string }[]
  onChange: (newValues: string[]) => void
}
