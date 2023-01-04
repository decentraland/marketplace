import { GenderFilterOption } from "@dcl/schemas"

export const AVAILABLE_FOR_MALE = 'AVAILABLE_FOR_MALE'
export const AVAILABLE_FOR_FEMALE = 'AVAILABLE_FOR_FEMALE'

export function getBodyShapeValue(bodyShapes: GenderFilterOption[] | undefined): string | undefined {
  const hasUnisex = bodyShapes?.includes(GenderFilterOption.UNISEX);
  const hasMale = bodyShapes?.includes(GenderFilterOption.MALE)
  const hasFemale = bodyShapes?.includes(GenderFilterOption.FEMALE)

  if (hasUnisex && hasFemale) {
    return AVAILABLE_FOR_FEMALE
  }

  if (hasUnisex && hasMale) {
    return AVAILABLE_FOR_MALE
  }

  return undefined
}
