import { animals } from '../data/animals.js'
import Section from '../components/ui/Section.jsx'
import CatalogSummary from '../components/animals/CatalogSummary.jsx'
import AnimalList from '../components/animals/AnimalList.jsx'

export default function HomePage() {
  return (
    <>
      <Section id="about" title="Про застосунок">
        <p>
          Це вебсайт для реєстру та підтримки бездомних тварин
          студентського містечка: тут зібрана інформація про те, які
          тварини живуть на території кампусу, де саме та чи потребують
          вони допомоги просто зараз.
        </p>
        <p>Перегляньте реєстр тварин та їхній поточний статус.</p>
      </Section>

      <Section id="catalog" title="Тварини кампусу">
        <CatalogSummary total={animals.length} />
        <AnimalList items={animals} />
      </Section>
    </>
  )
}
