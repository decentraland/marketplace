export type Estate = {
  size: number
  parcels: { x: number; y: number }[]
  data: {
    description: string
  } | null
}
