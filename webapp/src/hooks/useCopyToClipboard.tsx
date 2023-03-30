const copyToClipboard = (onCopy: () => void) => {
    navigator.clipboard.writeText(text)
    onCopy()
}

export default useCopyToClipboard
