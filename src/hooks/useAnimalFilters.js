import { useState } from 'react'

export default function useAnimalFilters(items) {
  const [query, setQuery] = useState('')
  const [onlyNeedsCare, setOnlyNeedsCare] = useState(false)
  const normalizedQuery = query.trim().toLocaleLowerCase('uk')
  const visibleItems = items.filter((item) => (
    item.name.toLocaleLowerCase('uk').includes(normalizedQuery)
    && (!onlyNeedsCare || item.needsCare)
  ))

  function resetFilters() {
    setQuery('')
    setOnlyNeedsCare(false)
  }

  return {
    query,
    setQuery,
    onlyNeedsCare,
    setOnlyNeedsCare,
    visibleItems,
    resetFilters,
  }
}
