import { expect, test } from 'vitest'
import { selectCareRequests } from './selectCareRequests.js'
import { testItem, savedRequest } from '../test/fixtures.js'

test('поєднує пошук, допомогу й порядок без зміни джерела', () => {
  const records = Object.freeze([
    Object.freeze({ ...savedRequest, id: 'r-1', visitsPerWeek: 4 }),
    Object.freeze({ ...savedRequest, id: 'r-2', visitsPerWeek: 1 }),
    Object.freeze({ ...savedRequest, id: 'r-3', needsSupplies: false }),
  ])

  const result = selectCareRequests(records, [testItem], {
    query: ' КИЦЬКУ ', supplies: 'yes', sort: 'visits-asc',
  })

  expect(result.map((record) => record.id)).toEqual(['r-2', 'r-1'])
  expect(records.map((record) => record.id)).toEqual(['r-1', 'r-2', 'r-3'])
})

test('числовий порядок за візитами порівнює числа, а не рядки', () => {
  const records = [
    { ...savedRequest, id: 'r-1', visitsPerWeek: 10 },
    { ...savedRequest, id: 'r-2', visitsPerWeek: 2 },
  ]

  const result = selectCareRequests(records, [testItem], {
    query: '', supplies: 'all', sort: 'visits-desc',
  })

  expect(result.map((record) => record.id)).toEqual(['r-1', 'r-2'])
})

test('відсутність збігів не видаляє початковий запис', () => {
  const records = [savedRequest]

  const result = selectCareRequests(records, [testItem], {
    query: 'несумісний пошуковий текст', supplies: 'all', sort: 'animal',
  })

  expect(result).toEqual([])
  expect(records).toEqual([savedRequest])
})
