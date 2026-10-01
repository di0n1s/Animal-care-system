import { Link, useNavigate, useParams } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'
import AppButton from '../components/ui/AppButton.jsx'
import CareStatusBadge from '../components/animals/CareStatusBadge.jsx'
import useAnimalSelection from '../hooks/useAnimalSelection.js'
import NotFoundPage from './NotFoundPage.jsx'

export default function AnimalDetailsPage({ items }) {
  const { animalId } = useParams()
  const navigate = useNavigate()
  const { selectAnimal } = useAnimalSelection()
  const item = items.find((entry) => entry.id === animalId)

  if (!item) {
    return (
      <NotFoundPage
        title="Тварину не знайдено"
        message="У локальному реєстрі немає запису з таким ідентифікатором."
      />
    )
  }

  function handlePrepareRequest() {
    selectAnimal(item.id)
    const search = new URLSearchParams({ animalId: item.id })
    navigate(`/requests/new?${search}`)
  }

  return (
    <>
      <PageHeading title={item.name} />
      <p className="species">{item.species} · {item.area}</p>
      <p>{item.description}</p>
      <p><CareStatusBadge needsCare={item.needsCare} /></p>
      <AppButton onClick={handlePrepareRequest}>
        Вибрати й підготувати заявку
      </AppButton>
      <p><Link to="/animals">До реєстру без фільтрів</Link></p>
    </>
  )
}
