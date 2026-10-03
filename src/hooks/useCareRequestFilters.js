import { useSearchParams } from 'react-router'

export default function useCareRequestFilters(requests, items) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const rawSupplies = searchParams.get('supplies')
  const supplies = ['yes', 'no'].includes(rawSupplies) ? rawSupplies : 'all'
  const rawSort = searchParams.get('sort')
  const sort = ['visits-asc', 'visits-desc'].includes(rawSort)
    ? rawSort
    : 'animal'
  const names = new Map(items.map((item) => [item.id, item.name]))
  const normalizedQuery = query.trim().toLocaleLowerCase('uk')

  const visibleRequests = requests.filter((request) => {
    const text = `${names.get(request.animalId) ?? ''} ${request.schedule}`
      .toLocaleLowerCase('uk')
    const matchesSupplies = supplies === 'all'
      || (supplies === 'yes' ? request.needsSupplies : !request.needsSupplies)
    return text.includes(normalizedQuery) && matchesSupplies
  })

  visibleRequests.sort((a, b) => {
    let order = 0
    if (sort === 'visits-asc') order = a.visitsPerWeek - b.visitsPerWeek
    else if (sort === 'visits-desc') order = b.visitsPerWeek - a.visitsPerWeek
    else {
      order = (names.get(a.animalId) ?? '')
        .localeCompare(names.get(b.animalId) ?? '', 'uk')
    }
    return order || a.id.localeCompare(b.id)
  })

  function setParameter(name, value, defaultValue, replace = false) {
    const next = new URLSearchParams(searchParams)
    if (value === defaultValue) next.delete(name)
    else next.set(name, value)
    setSearchParams(next, { replace })
  }

  function resetFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('supplies')
    next.delete('sort')
    setSearchParams(next)
  }

  return {
    query,
    supplies,
    sort,
    visibleRequests,
    setQuery: (value) => setParameter('q', value, '', true),
    setSupplies: (value) => setParameter('supplies', value, 'all'),
    setSort: (value) => setParameter('sort', value, 'animal'),
    resetFilters,
  }
}
