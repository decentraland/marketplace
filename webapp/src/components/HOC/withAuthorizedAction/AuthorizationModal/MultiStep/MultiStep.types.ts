export type Step = {
  title: string
  description?: string
  isLoading?: boolean
  message?: string | JSX.Element
  action?: string
  actionDescription?: string
  onActionClicked: () => void
}

export type Props = {
  steps: Step[]
  currentStep: number
}
