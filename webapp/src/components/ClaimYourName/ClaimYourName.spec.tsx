import { render } from '@testing-library/react'
import ClaimYourName from './ClaimYourName'

jest.mock('../../lib/environment', () => {
  return {
    builderUrl: 'https://mocked-builder-url.com'
  }
})

describe('ClaimYourName', () => {
  it('should have a link to the builder with the names path', async () => {
    const { findByRole } = render(<ClaimYourName />)
    const button = await findByRole('button')
    expect(button.getAttribute('href')).toBe(
      `https://mocked-builder-url.com/claim-name`
    )
  })
})
