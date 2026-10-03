import { Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import RequestsLayout from './components/layout/RequestsLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import CatalogContainer from './pages/CatalogContainer.jsx'
import AnimalDetailsPage from './pages/AnimalDetailsPage.jsx'
import RequestsPage from './pages/RequestsPage.jsx'
import CareRequestCreatePage from './pages/CareRequestCreatePage.jsx'
import CareRequestDetailsPage from './pages/CareRequestDetailsPage.jsx'
import CareRequestEditPage from './pages/CareRequestEditPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { animals } from './data/animals.js'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout items={animals} />}>
        <Route index element={<HomePage />} />

        <Route path="animals">
          <Route index element={<CatalogContainer items={animals} />} />
          <Route
            path=":animalId"
            element={<AnimalDetailsPage items={animals} />}
          />
        </Route>

        <Route path="requests" element={<RequestsLayout />}>
          <Route index element={<RequestsPage items={animals} />} />
          <Route path="new" element={<CareRequestCreatePage items={animals} />} />
          <Route
            path=":requestId"
            element={<CareRequestDetailsPage items={animals} />}
          />
          <Route
            path=":requestId/edit"
            element={<CareRequestEditPage items={animals} />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
