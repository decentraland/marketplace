import {
  isNameAvailable,
  isNameValid,
  getNameInvalidType,
  hasNameMinLength,
  isEnoughClaimMana,
  NameInvalidType
} from './utils'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'

jest.mock('../../contracts/factories/DCLRegistrar__factory')

describe('Name Management Tests', () => {
  describe('isNameAvailable', () => {
    describe('and the name is available', () => {
      beforeEach(() => {
        // Mock the contract call to simulate an available name
        const mockAvailable = jest.fn().mockResolvedValue(true)
        ;(DCLRegistrar__factory.connect as jest.Mock).mockImplementation(() => {
          return { available: mockAvailable }
        })
      })
      it('should return true', async () => {
        const result = await isNameAvailable('availableName')
        expect(result).toBe(true)
      })
    })

    describe('and the name is not available', () => {
      beforeEach(() => {
        // Mock the contract call to simulate an available name
        const mockAvailable = jest.fn().mockResolvedValue(false)
        ;(DCLRegistrar__factory.connect as jest.Mock).mockImplementation(() => {
          return { available: mockAvailable }
        })
      })
      it('should return false', async () => {
        const result = await isNameAvailable('unavailableName')
        expect(result).toBe(false)
      })
    })

    describe('and providing an empty name', () => {
      it('should return false', async () => {
        const result = await isNameAvailable('')
        expect(result).toBe(false)
      })
    })
  })

  describe('isNameValid', () => {
    let name: string
    describe('when the name is valid', () => {
      beforeEach(() => {
        name = 'validName123'
      })
      it('should return true', () => {
        expect(isNameValid(name)).toBe(true)
      })
    })

    describe('when the name is too short', () => {
      beforeEach(() => {
        name = 'a'
      })
      it('should return false', () => {
        expect(isNameValid('a')).toBe(false)
      })
    })
    describe('when the name is too long', () => {
      beforeEach(() => {
        name = 'averylongnamethatiswaytoobig'
      })
      it('should return false', () => {
        expect(isNameValid('averylongnamethatiswaytoobig')).toBe(false)
      })
    })
    describe('when the name has invalid characters', () => {
      beforeEach(() => {
        name = 'invalid#Name'
      })
      it('should return false', () => {
        expect(isNameValid(name)).toBe(false)
      })
    })
    describe('when the name has whitespaces', () => {
      beforeEach(() => {
        name = 'invalid name'
      })
      it('should return false', () => {
        expect(isNameValid(name)).toBe(false)
      })
    })
  })

  describe('getNameInvalidType', () => {
    let name: string
    describe('when the name is valid', () => {
      beforeEach(() => {
        name = 'validName'
      })
      it('should return null', () => {
        expect(getNameInvalidType(name)).toBeNull()
      })
    })

    describe('when the name is too long', () => {
      beforeEach(() => {
        name = 'averylongnamethatiswaytoobig'
      })
      it('should return TOO_LONG', () => {
        expect(getNameInvalidType(name)).toBe(NameInvalidType.TOO_LONG)
      })
    })

    describe('when the name is too short', () => {
      beforeEach(() => {
        name = 'a'
      })
      it('should return TOO_SHORT', () => {
        expect(getNameInvalidType(name)).toBe(NameInvalidType.TOO_SHORT)
      })
    })

    describe('when the name has spaces', () => {
      beforeEach(() => {
        name = 'invalid name'
      })
      it('should return HAS_SPACES', () => {
        expect(getNameInvalidType(name)).toBe(NameInvalidType.HAS_SPACES)
      })
    })

    describe('when the name has invalid characters', () => {
      beforeEach(() => {
        name = 'invalid#Name'
      })
      it('should return INVALID_CHARACTERS', () => {
        expect(getNameInvalidType(name)).toBe(
          NameInvalidType.INVALID_CHARACTERS
        )
      })
    })
  })

  describe('hasNameMinLength', () => {
    let name: string
    describe('and the name has length equal or above minimum', () => {
      beforeEach(() => {
        name = 'va'
      })
      it('should return true', () => {
        expect(hasNameMinLength(name)).toBe(true)
      })
    })

    describe('and the name has length below the minimum', () => {
      beforeEach(() => {
        name = 'v'
      })
      it('should return false', () => {
        expect(hasNameMinLength(name)).toBe(false)
      })
    })
  })

  describe('isEnoughClaimMana', () => {
    let mana: number
    describe('and has sufficient MANA', () => {
      beforeEach(() => {
        mana = 100
      })
      it('should return true', () => {
        expect(isEnoughClaimMana(mana)).toBe(true)
      })
    })

    describe('and has insufficient MANA', () => {
      beforeEach(() => {
        mana = 99
      })
      it('should return false', () => {
        expect(isEnoughClaimMana(mana)).toBe(false)
      })
    })
  })
})
