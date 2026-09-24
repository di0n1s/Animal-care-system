import CareRequestPage from './CareRequestPage.jsx'
import useAnimalSelection from '../hooks/useAnimalSelection.js'

export default function CareRequestContainer() {
  const { selectedId, selectedItem, clearSelection } = useAnimalSelection()

  return (
    <CareRequestPage
      key={selectedId ?? 'empty'}
      item={selectedItem}
      onClearSelection={clearSelection}
    />
  )
}
