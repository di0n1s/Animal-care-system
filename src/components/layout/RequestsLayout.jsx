import { NavLink, Outlet } from 'react-router'
import CareRequestNotice from '../requests/CareRequestNotice.jsx'

export default function RequestsLayout() {
  return (
    <>
      <nav aria-label="Навігація розділом заявок">
        <ul className="nav-list">
          <li><NavLink to="." end>Список заявок</NavLink></li>
          <li><NavLink to="new">Нова заявка</NavLink></li>
        </ul>
      </nav>
      <p>Локальні дані зберігаються до перезавантаження сторінки.</p>
      <CareRequestNotice />
      <Outlet />
    </>
  )
}
