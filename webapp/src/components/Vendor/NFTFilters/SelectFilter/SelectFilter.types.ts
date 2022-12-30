export type Props = {
  name: string
  value: string
  clearable?: boolean
  options: Option[]
  disabled?: boolean
  placeholder?: string
  className?: string
  fetchOptions?: (search: string) => Promise<Option[]>
  fetchOptionFromValue?: (value: string) => Promise<Option | null>
  onChange: (newValue: string) => void
}

export type Option = { value: string; text: string }
