import HomePage from './HomePage.jsx'
import useAnimalSelection from '../hooks/useAnimalSelection.js'

export default function CatalogContainer({ items }) {
  const { selectedId, selectAnimal } = useAnimalSelection()

  return (
    <HomePage
      items={items}
      selectedId={selectedId}
      onSelect={selectAnimal}
    />
  )
}
