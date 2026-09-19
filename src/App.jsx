import AppLayout from './components/layout/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import CareRequestPage from './pages/CareRequestPage.jsx'
import { animals } from './data/animals.js'

const navigationLinks = [
  { href: '#about', label: 'Про застосунок' },
  { href: '#catalog', label: 'Реєстр тварин' },
  { href: '#request', label: 'Заявка на догляд' },
]

export default function App() {
  const exampleAnimal = animals.find((item) => item.id === 'an-001')

  return (
    <AppLayout title="Система контролю та опіки тварин" links={navigationLinks}>
      <HomePage />
      <CareRequestPage item={exampleAnimal} />
    </AppLayout>
  )
}
