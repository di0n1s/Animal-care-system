import HomePage from './pages/HomePage.jsx'

export default function App() {
  return (
    <>
      <header className="site-header">
        <span>Система контролю та опіки тварин</span>
        <nav aria-label="Основна навігація">
          <a href="#about">Про застосунок</a>
          <a href="#catalog">Реєстр тварин</a>
        </nav>
      </header>
      <main>
        <HomePage />
      </main>
      <footer>Навчальний проєкт. Початковий реєстр тварин.</footer>
    </>
  )
}
