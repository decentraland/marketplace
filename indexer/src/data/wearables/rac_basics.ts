import { Wearable } from './Wearable'

export let rac_basics: Wearable[] = [
  new Wearable(
    'rac_feet',
    'RAC footwear',
    "RAC's signature pink footwear.",
    'feet',
    'unique',
    ['BaseMale', 'BaseFemale']
  ),
  new Wearable(
    'rac_hat',
    'RAC Cap',
    "RAC's signature pink baseball cap.",
    'hat',
    'unique',
    ['BaseMale', 'BaseFemale']
  ),
  new Wearable(
    'rac_upper_body',
    'RAC Outfit',
    "RAC's signature pink outfit with matching trousers and long coat.",
    'upper_body',
    'unique',
    ['BaseMale', 'BaseFemale']
  )
]

