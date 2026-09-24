import { useState } from 'react'
import { AnimalSelectionContext } from '../context/AnimalSelectionContext.js'

export default function AnimalSelectionProvider({ items, children }) {
  const [selectedId, setSelectedId] = useState(null)
  const selectedItem = items.find((item) => item.id === selectedId)

  function selectAnimal(id) {
    if (items.some((item) => item.id === id)) {
      setSelectedId(id)
    }
  }

  function clearSelection() {
    setSelectedId(null)
  }

  const value = {
    selectedId,
    selectedItem,
    selectAnimal,
    clearSelection,
  }

  return (
    <AnimalSelectionContext.Provider value={value}>
      {children}
    </AnimalSelectionContext.Provider>
  )
}
