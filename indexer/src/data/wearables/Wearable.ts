export class Wearable {
  id: string
  name: string
  description: string
  category: string
  rarity: string
  bodyShapes: string[]

  constructor(
    id: string,
    name: string,
    description: string,
    category: string,
    rarity: string,
    bodyShapes: string[]
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.category = category
    this.rarity = rarity
    this.bodyShapes = bodyShapes
  }
}
