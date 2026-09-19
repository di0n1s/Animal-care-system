import CareStatusBadge from './CareStatusBadge.jsx'

export default function AnimalCard({ item }) {
  return (
    <article className="animal-card">
      <h3>{item.name}</h3>
      <p className="species">{item.species} · {item.area}</p>
      <p>{item.description}</p>
      <p><CareStatusBadge needsCare={item.needsCare} /></p>
    </article>
  )
}
