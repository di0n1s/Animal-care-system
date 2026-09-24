import { useContext } from 'react'
import { AnimalSelectionContext } from '../context/AnimalSelectionContext.js'

export default function useAnimalSelection() {
  const selection = useContext(AnimalSelectionContext)

  if (selection === null) {
    throw new Error(
      'useAnimalSelection must be used within AnimalSelectionProvider',
    )
  }

  return selection
}
