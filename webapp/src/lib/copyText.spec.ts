import copyText from './copyText'

describe('when calling the copy text function', () => {
  let writeTextSpy: jest.SpyInstance
  let onCopyMock: jest.Mock

  beforeAll(() => {
    //since the clipboard api is not available on the react server!!
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
        readText: jest.fn()
      },
      writable: true
    })
  })

  beforeEach(() => {
    onCopyMock = jest.fn()
    writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText')
  })

  it('should write the text to the clipboard and execute the onCopy callback', async () => {
    await copyText('someText', onCopyMock)
    expect(onCopyMock).toHaveBeenCalled()
    expect(writeTextSpy).toHaveBeenCalledWith('someText')
  })
})
