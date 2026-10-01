import { useSearchParams } from 'react-router'

export default function useAnimalFilters(items) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const onlyNeedsCare = searchParams.get('needsCare') === '1'
  const normalizedQuery = query.trim().toLocaleLowerCase('uk')
  const visibleItems = items.filter((item) => (
    item.name.toLocaleLowerCase('uk').includes(normalizedQuery)
    && (!onlyNeedsCare || item.needsCare)
  ))

  function setQuery(value) {
    const next = new URLSearchParams(searchParams)
    if (value === '') next.delete('q')
    else next.set('q', value)
    setSearchParams(next, { replace: true })
  }

  function setOnlyNeedsCare(value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('needsCare', '1')
    else next.delete('needsCare')
    setSearchParams(next)
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('needsCare')
    setSearchParams(next)
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
