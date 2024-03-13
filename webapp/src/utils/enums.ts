type Enum<E> = Record<keyof E, number | string>
type Keys<E> = keyof Enum<E>
type Values<E> = E[Keys<E>]

export const isOfEnumType = <T extends Enum<T>>(value: unknown, enumObject: T): value is Values<T> => {
  return Object.values(enumObject).includes(value)
}
