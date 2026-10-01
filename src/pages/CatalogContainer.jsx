import AnimalListPage from './AnimalListPage.jsx'
import useAnimalSelection from '../hooks/useAnimalSelection.js'

export default function CatalogContainer({ items }) {
  const { selectedId, selectAnimal } = useAnimalSelection()

  return (
    <AnimalListPage
      items={items}
      selectedId={selectedId}
      onSelect={selectAnimal}
    />
  )
}
