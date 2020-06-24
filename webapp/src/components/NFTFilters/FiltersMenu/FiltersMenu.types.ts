export type Props = {
  selectedCollection?: string
  selectedRarities: string[]
  selectedGenders: string[]
  onCollectionsChange: (contract: string) => void
  onGendersChange: (options: string[]) => void
  onRaritiesChange: (options: string[]) => void
}
