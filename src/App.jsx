import AppLayout from './components/layout/AppLayout.jsx'
import AnimalSelectionProvider from './providers/AnimalSelectionProvider.jsx'
import CatalogContainer from './pages/CatalogContainer.jsx'
import CareRequestContainer from './pages/CareRequestContainer.jsx'
import { animals } from './data/animals.js'

const navigationLinks = [
  { href: '#about', label: 'Про застосунок' },
  { href: '#catalog', label: 'Реєстр тварин' },
  { href: '#request', label: 'Заявка на догляд' },
]

export default function App() {
  return (
    <AppLayout title="Система контролю та опіки тварин" links={navigationLinks}>
      <AnimalSelectionProvider items={animals}>
        <CatalogContainer items={animals} />
        <CareRequestContainer />
      </AnimalSelectionProvider>
    </AppLayout>
  )
}
