export class Wearable {
  id: string
  name: string
  description: string
  category: string
  rarity: string

  constructor(
    id: string,
    name: string,
    description: string,
    category: string,
    rarity: string
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.category = category
    this.rarity = rarity
  }
}
