export function selectCareRequests(requests, items, { query, supplies, sort }) {
  const names = new Map(items.map((item) => [item.id, item.name]))
  const normalizedQuery = query.trim().toLocaleLowerCase('uk')

  const selected = requests.filter((request) => {
    const text = `${names.get(request.animalId) ?? ''} ${request.schedule}`
      .toLocaleLowerCase('uk')
    const matchesSupplies = supplies === 'all'
      || (supplies === 'yes' ? request.needsSupplies : !request.needsSupplies)
    return text.includes(normalizedQuery) && matchesSupplies
  })

  return selected.sort((a, b) => {
    let order = 0
    if (sort === 'visits-asc') order = a.visitsPerWeek - b.visitsPerWeek
    else if (sort === 'visits-desc') order = b.visitsPerWeek - a.visitsPerWeek
    else {
      order = (names.get(a.animalId) ?? '')
        .localeCompare(names.get(b.animalId) ?? '', 'uk')
    }
    return order || a.id.localeCompare(b.id)
  })
}
