import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'

export default function HomePage() {
  return (
    <>
      <PageHeading title="Система контролю та опіки тварин" />
      <p>
        Це вебсайт для реєстру та підтримки бездомних тварин
        студентського містечка.
      </p>
      <p>Перегляньте тварин і підготуйте чернетку заявки на догляд.</p>
      <p><Link to="/animals">Перейти до реєстру тварин</Link></p>
      <p><Link to="/requests">Переглянути демонстраційні заявки</Link></p>
    </>
  )
}
