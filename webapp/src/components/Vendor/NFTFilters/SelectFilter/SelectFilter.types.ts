export type Props = {
  name: string
  value: string
  clearable?: boolean
  options: Option[]
  fetchOptions?: (search: string) => Promise<Option[]>
  fetchOptionFromValue?: (value: string) => Promise<Option | null>
  onChange: (newValue: string) => void
  disabled?: boolean
}

export type Option = { value: string; text: string }
