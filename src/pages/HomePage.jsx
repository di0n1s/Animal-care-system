import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/animals/CatalogSummary.jsx'
import AnimalFilters from '../components/animals/AnimalFilters.jsx'
import AnimalList from '../components/animals/AnimalList.jsx'
import useAnimalFilters from '../hooks/useAnimalFilters.js'

export default function HomePage({ items, selectedId, onSelect }) {
  const {
    query,
    setQuery,
    onlyNeedsCare,
    setOnlyNeedsCare,
    visibleItems,
    resetFilters,
  } = useAnimalFilters(items)

  return (
    <>
      <Section id="about" title="Про застосунок">
        <p>
          Це вебсайт для реєстру та підтримки бездомних тварин
          студентського містечка.
        </p>
        <p>Виберіть тварину і перейдіть до підготовки чернетки заявки.</p>
      </Section>

      <Section id="catalog" title="Тварини кампусу">
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
        <p><a href="#request">Перейти до чернетки заявки</a></p>
      </Section>
    </>
  )
}
