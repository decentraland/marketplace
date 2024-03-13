const copyText = async (text: string, onCopy: () => void) => {
  await navigator.clipboard.writeText(text)
  onCopy()
}

export default copyText
