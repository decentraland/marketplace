type BaseStep = {
  title: string
  description?: string
  isLoading?: boolean
  message?: string
}

type PendingStep = BaseStep & {
  action: string
  actionDescription?: string
  onActionClicked: () => void
}

export type Step = PendingStep | BaseStep

export type Props = {
  steps: Step[]
  currentStep: number
}
