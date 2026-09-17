import AnimalCard from '../components/AnimalCard.jsx'
import { animals } from '../data/animals.js'

export default function HomePage() {
  return (
    <>
      <section id="about" aria-labelledby="about-title">
        <h1 id="about-title">Система контролю та опіки тварин</h1>
        <p>
          Це вебсайт для реєстру та підтримки бездомних тварин
          студентського містечка: тут зібрана інформація про те, які
          тварини живуть на території кампусу, де саме та чи потребують
          вони допомоги просто зараз.
        </p>
        <p>Перегляньте реєстр тварин та їхній поточний статус.</p>
      </section>

      <section id="catalog" aria-labelledby="catalog-title">
        <h2 id="catalog-title">Тварини кампусу</h2>
        <p>Тварин у реєстрі: {animals.length}</p>
        {animals.length === 0 ? (
          <p>Тварин ще не додано до реєстру.</p>
        ) : (
          <ul className="animal-grid">
            {animals.map((item) => (
              <li key={item.id}>
                <AnimalCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
