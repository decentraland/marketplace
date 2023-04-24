export type Step = {
  title: string
  description?: string
  isLoading?: boolean
  message?: string | JSX.Element
  action?: string
  actionDescription?: string
  testId?: string
  onActionClicked: () => void
}

export type Props = {
  steps: Step[]
  currentStep: number
}
