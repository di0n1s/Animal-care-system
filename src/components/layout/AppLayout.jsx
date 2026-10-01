import { Outlet } from 'react-router'
import SiteHeader from './SiteHeader.jsx'
import AnimalSelectionProvider from '../../providers/AnimalSelectionProvider.jsx'

const navigationLinks = [
  { to: '/', label: 'Головна', end: true },
  { to: '/animals', label: 'Тварини' },
  { to: '/requests', label: 'Заявки' },
]

export default function AppLayout({ items }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Перейти до вмісту</a>
      <SiteHeader title="Система контролю та опіки тварин" links={navigationLinks} />
      <main id="main-content" tabIndex={-1}>
        <AnimalSelectionProvider items={items}>
          <Outlet />
        </AnimalSelectionProvider>
      </main>
      <footer>Навчальний проєкт. Реєстр тварин і заявки на догляд.</footer>
    </>
  )
}
