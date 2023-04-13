const copyText = (text: string, onCopy: () => void) => {
  navigator.clipboard.writeText(text)
  onCopy()
}

export default copyText
