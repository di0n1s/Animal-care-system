import AnimalCard from './AnimalCard.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function AnimalList({ items }) {
  if (items.length === 0) {
    return (
      <EmptyState title="Тварин ще не додано до реєстру.">
        <p>Після додавання записів тут з'являться картки тварин.</p>
      </EmptyState>
    )
  }

  return (
    <ul className="animal-grid">
      {items.map((item) => (
        <li key={item.id}>
          <AnimalCard item={item} />
        </li>
      ))}
    </ul>
  )
}
