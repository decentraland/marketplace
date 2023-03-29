const useCopyToClipboard = (setHasCopied: () => void) => {
  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setHasCopied()
  }
  return copy
}

export default useCopyToClipboard
