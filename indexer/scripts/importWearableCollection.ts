import * as fs from 'fs'
import * as path from 'path'

const prettier = require('prettier')

enum RarityId {
  SWANKY = 'swanky',
  EPIC = 'epic',
  LENGENDARY = 'legendary',
  MYTHIC = 'mythic',
  UNIQUE = 'unique'
}
type Wearable = {
  id: string
  representations: {
    bodyShapes: string[]
    mainFile: string
    contents: {
      file: string
      hash: string
    }[]
  }[]
  type: string
  category: string
  tags: string[]
  baseUrl: string
  i18n: {
    code: string
    text: string
  }[]
  thumbnail: string
  image: string | undefined
  rarity?: RarityId
  description?: string
  issuedId?: number
}
type Collection = Wearable[]

function importCollection() {
  const collection = getCollectionJson()

  // new Wearable(id, name, description, category, rarity, bodyShapes)
  const wearables = collection.map(
    wearable =>
      // prettier-ignore
      ` new Wearable(
    ${getWearableId(wearable)},
    ${getWearableName(wearable)},
    ${getWearableDescription(wearable)},
    ${getWearableCategory(wearable)},
    ${getWearableRarity(wearable)},
    ${getWearableBodyShapes(wearable)}
  ),`
  )

  const wearableFile = `
import { Wearable } from './Wearable'

export let ${getCollectionName()}: Wearable[] = [
${wearables.join('\n')}
]`

  console.log(
    prettier.format(wearableFile, {
      printWidth: 80,
      singleQuote: true,
      semi: false,
      tabSize: 2,
      parser: 'babel'
    })
  )
}

// ------------------------------------------------------------------
// Wearable -------------------------------------------------------

function getWearableId(wearable: Wearable) {
  return JSON.stringify(path.basename(wearable.id))
}

function getWearableDescription(wearable: Wearable) {
  return JSON.stringify(wearable.description)
}

function getWearableCategory(wearable: Wearable) {
  return JSON.stringify(wearable.category)
}

function getWearableName(wearable: Wearable) {
  const enTranslation = wearable.i18n.find(
    translation => translation.code === 'en'
  )
  return JSON.stringify(enTranslation.text)
}

function getWearableRarity(wearable: Wearable) {
  return JSON.stringify(wearable.rarity)
}

function getWearableBodyShapes(wearable: Wearable) {
  const allBodyShapes = wearable.representations.map(
    representation => representation.bodyShapes
  )

  // body shape = dcl://base-avatars/BaseFemale
  const bodyShapes = new Set<string>()
  for (const representationBodyShapes of allBodyShapes) {
    for (const bodyShape of representationBodyShapes) {
      bodyShapes.add(path.basename(bodyShape))
    }
  }

  return JSON.stringify(Array.from(bodyShapes))
}

// ------------------------------------------------------------------
// Collection -------------------------------------------------------

function getCollectionName() {
  const collectionPath = getCollectionPath() // we want the folder name
  return path.basename(path.dirname(collectionPath))
}

function getCollectionJson(): Collection {
  const collectionPath = getCollectionPath()

  const collection = fs.readFileSync(collectionPath, 'utf-8')
  try {
    return JSON.parse(collection)
  } catch (error) {
    throw new Error(
      `Failed to parse collection json with error: "${error.message}"`
    )
  }
}

function getCollectionPath() {
  let collectionPath = ''
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--collection') {
      collectionPath = process.argv[i + 1]
      break
    }
  }

  if (!collectionPath) {
    throw new Error(
      'Supply the path to the collection json file using --collection'
    )
  }
  return collectionPath
}

importCollection()
