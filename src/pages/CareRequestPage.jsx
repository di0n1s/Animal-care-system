import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import CareStatusBadge from '../components/animals/CareStatusBadge.jsx'
import CareRequestFormPreview from '../components/requests/CareRequestFormPreview.jsx'

export default function CareRequestPage({ item }) {
  return (
    <Section id="request" title="Підготовка заявки на догляд">
      {item ? (
        <>
          <p>
            Приклад для тварини «{item.name}»:{' '}
            <CareStatusBadge needsCare={item.needsCare} />
          </p>
          <CareRequestFormPreview
            idPrefix="care-request-preview"
            animalName={item.name}
          />
        </>
      ) : (
        <EmptyState title="Немає тварини для макета заявки.">
          <p><a href="#catalog">Переглянути реєстр тварин</a></p>
        </EmptyState>
      )}
    </Section>
  )
}
