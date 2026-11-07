import { expect, test } from 'vitest'
import { toAnimal, toAnimalList } from './animalContract.js'
import { animals } from '../test/fixtures.js'

test('розбирає список із JSON-файлу у внутрішню модель', () => {
  const result = toAnimalList(animals)

  expect(result).toHaveLength(animals.length)
  expect(result[0]).toEqual(animals[0])
  expect(result[0]).not.toBe(animals[0])
})

test('обрізає пробіли в імені та відкидає зайві поля', () => {
  const result = toAnimal({ ...animals[0], name: '  Мурка  ', secret: 'x' })

  expect(result.name).toBe('Мурка')
  expect(result).not.toHaveProperty('secret')
})

test.each([
  { label: 'оболонка замість масиву', value: { items: animals } },
  { label: 'рядок замість логічного значення', value: [{ ...animals[0], needsCare: 'true' }] },
  { label: 'порожній id', value: [{ ...animals[0], id: ' ' }] },
  { label: 'відсутнє поле', value: [{ id: 'an-x', name: 'Тест' }] },
  { label: 'null замість запису', value: [null] },
  { label: 'повторні id', value: [animals[0], { ...animals[0] }] },
])('відхиляє некоректні дані: $label', ({ value }) => {
  expect(() => toAnimalList(value)).toThrowError(
    expect.objectContaining({ code: 'BAD_DATA' }),
  )
})
