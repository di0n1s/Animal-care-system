import AnimalCard from './AnimalCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function AnimalList({
  items,
  selectedId,
  onSelect,
  emptyTitle = 'Тварин ще не додано до реєстру.',
}) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} />
  }

  return (
    <ul className="animal-grid">
      {items.map((item) => (
        <li key={item.id}>
          <AnimalCard
            item={item}
            selected={item.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  )
}
