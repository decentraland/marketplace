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
    it('should return true for a valid name', () => {
      expect(isNameValid('validName123')).toBe(true)
    })

    it('should return false for a name that is too short', () => {
      expect(isNameValid('a')).toBe(false)
    })

    it('should return false for a name that is too long', () => {
      expect(isNameValid('averylongnamethatiswaytoobig')).toBe(false)
    })

    it('should return false for a name with invalid characters', () => {
      expect(isNameValid('invalid#Name')).toBe(false)
    })

    it('should return false for a name with spaces', () => {
      expect(isNameValid('invalid name')).toBe(false)
    })
  })

  describe('getNameInvalidType', () => {
    it('should return null for a valid name', () => {
      expect(getNameInvalidType('validName')).toBeNull()
    })

    it('should return TOO_LONG for a name that is too long', () => {
      expect(getNameInvalidType('averylongnamethatiswaytoobig')).toBe(
        NameInvalidType.TOO_LONG
      )
    })

    it('should return TOO_SHORT for a name that is too short', () => {
      expect(getNameInvalidType('a')).toBe(NameInvalidType.TOO_SHORT)
    })

    it('should return HAS_SPACES for a name with spaces', () => {
      expect(getNameInvalidType('invalid name')).toBe(
        NameInvalidType.HAS_SPACES
      )
    })

    it('should return INVALID_CHARACTERS for a name with invalid characters', () => {
      expect(getNameInvalidType('invalid#Name')).toBe(
        NameInvalidType.INVALID_CHARACTERS
      )
    })
  })

  describe('hasNameMinLength', () => {
    it('should return true for a name with length equal or above minimum', () => {
      expect(hasNameMinLength('va')).toBe(true)
    })

    it('should return false for a name with length below minimum', () => {
      expect(hasNameMinLength('v')).toBe(false)
    })
  })

  describe('isEnoughClaimMana', () => {
    it('should return true for sufficient MANA', () => {
      expect(isEnoughClaimMana(100)).toBe(true)
    })

    it('should return false for insufficient MANA', () => {
      expect(isEnoughClaimMana(99)).toBe(false)
    })
  })
})
