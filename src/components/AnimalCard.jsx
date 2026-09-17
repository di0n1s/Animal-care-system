export default function AnimalCard({ item }) {
  const status = item.needsCare ? 'Потребує допомоги' : 'Уже під опікою'

  return (
    <article className="animal-card">
      <h3>{item.name}</h3>
      <p className="species">{item.species} · {item.area}</p>
      <p>{item.description}</p>
      <p className={item.needsCare ? 'status needs-care' : 'status'}>
        {status}
      </p>
    </article>
  )
}
