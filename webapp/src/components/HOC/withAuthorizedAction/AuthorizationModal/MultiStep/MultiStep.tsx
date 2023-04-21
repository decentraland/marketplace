import classNames from 'classnames'
import { Button, Loader } from 'decentraland-ui'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'

import { Props } from './MultiStep.types'
import './MultiStep.css'

export default function MultiStep({ steps, currentStep }: Props): JSX.Element {
  return (
    <div className="ui-multi-step" data-testid="multi-step">
      {steps.map((step, index) => {
        const showAction = step.action && currentStep <= index && !step.isLoading
        const isDisabled = index > currentStep
        return (
          <div
            key={`step-${index}`}
            className={classNames('step-container', {
              disabled: isDisabled
            })}
          >
            <div>
              <span className="step-position">{index + 1}</span>
            </div>
            <div className="step-info">
              <p className="step-title">{step.title}</p>
              {step.description ? (
                <p className="step-description">{step.description}</p>
              ) : null}
              {showAction ? (
                <div className='step-action-container'>
                  <Button
                    primary
                    onClick={step.onActionClicked}
                    className="step-action"
                    disabled={isDisabled}
                  >
                    {step.action}
                  </Button>
                  {step.message ? <span>{step.message}</span> : null}
                </div>
              ) : (
                <div className="step-message">
                  {step.isLoading ? (
                    <Loader size="small" active className="loader" />
                  ) : (
                    <Icon className="check-icon" name="check" />
                  )}
                  {step.message ? <span>{step.message}</span> : null}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
