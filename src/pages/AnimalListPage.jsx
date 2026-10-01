import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/animals/CatalogSummary.jsx'
import AnimalFilters from '../components/animals/AnimalFilters.jsx'
import AnimalList from '../components/animals/AnimalList.jsx'
import useAnimalFilters from '../hooks/useAnimalFilters.js'

export default function AnimalListPage({ items, selectedId, onSelect }) {
  const {
    query,
    setQuery,
    onlyNeedsCare,
    setOnlyNeedsCare,
    visibleItems,
    resetFilters,
  } = useAnimalFilters(items)
  const requestSearch = selectedId
    ? `?${new URLSearchParams({ animalId: selectedId })}`
    : ''

  return (
    <>
      <PageHeading title="Реєстр тварин" />
      <Section id="catalog" title="Пошук і вибір">
        <CatalogSummary total={items.length} />
        <AnimalFilters
          query={query}
          onlyNeedsCare={onlyNeedsCare}
          onQueryChange={setQuery}
          onOnlyNeedsCareChange={setOnlyNeedsCare}
          onReset={resetFilters}
        />
        <p>Показано тварин: {visibleItems.length}</p>
        <AnimalList
          items={visibleItems}
          selectedId={selectedId}
          onSelect={onSelect}
          emptyTitle={items.length === 0
            ? 'Тварин ще не додано до реєстру.'
            : 'За цими фільтрами нічого не знайдено.'}
        />
        <p>
          <Link to={`/requests/new${requestSearch}`}>
            Підготувати нову заявку
          </Link>
        </p>
      </Section>
    </>
  )
}
