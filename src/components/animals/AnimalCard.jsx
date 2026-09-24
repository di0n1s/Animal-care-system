import { useState } from 'react'
import CareStatusBadge from './CareStatusBadge.jsx'
import AppButton from '../ui/AppButton.jsx'

export default function AnimalCard({ item, selected, onSelect }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const descriptionId = `animal-${item.id}-description`

  return (
    <article className="animal-card">
      <h3>{item.name}</h3>
      <p className="species">{item.species} · {item.area}</p>
      <p><CareStatusBadge needsCare={item.needsCare} /></p>

      <AppButton
        variant="secondary"
        aria-expanded={detailsOpen}
        aria-controls={descriptionId}
        onClick={() => setDetailsOpen((previous) => !previous)}
      >
        {detailsOpen ? 'Згорнути опис' : 'Показати опис'}
      </AppButton>
      <p id={descriptionId} hidden={!detailsOpen}>{item.description}</p>

      <p>
        <AppButton
          aria-pressed={selected}
          onClick={() => onSelect(item.id)}
        >
          Обрати «{item.name}»
        </AppButton>
      </p>
      {selected && <p className="selection-note">Обрано для чернетки заявки.</p>}
    </article>
  )
}
