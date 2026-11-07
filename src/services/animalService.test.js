import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { animalService, clearAnimalCache } from './animalService.js'
import { animals } from '../test/fixtures.js'

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  clearAnimalCache()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('завантажує й розбирає JSON за адресою mock-api', async () => {
  const fetchMock = vi.fn().mockResolvedValue(jsonResponse(animals))
  vi.stubGlobal('fetch', fetchMock)

  const result = await animalService.getAll()

  expect(result).toEqual(animals)
  expect(fetchMock).toHaveBeenCalledWith(
    '/mock-api/animals.json',
    expect.objectContaining({ headers: { Accept: 'application/json' } }),
  )
})

test('після успіху читає файл один раз і повертає незалежні копії', async () => {
  const fetchMock = vi.fn().mockImplementation(async () => jsonResponse(animals))
  vi.stubGlobal('fetch', fetchMock)

  const first = await animalService.getAll()
  first[0].name = 'Змінено'
  const second = await animalService.getAll()

  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(second[0].name).toBe(animals[0].name)
})

test('відсутній файл (404) не кешується й не вважається порожнім реєстром', async () => {
  vi.stubGlobal('fetch', vi.fn()
    .mockResolvedValueOnce(new Response(null, { status: 404 }))
    .mockImplementationOnce(async () => jsonResponse(animals)))

  await expect(animalService.getAll()).rejects.toMatchObject({
    code: 'NOT_FOUND', status: 404,
  })
  await expect(animalService.getAll()).resolves.toEqual(animals)
})

test('HTML замість JSON (типова відповідь dev-сервера на невірний шлях)', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response('<!doctype html><html></html>', { status: 200 }),
  ))

  await expect(animalService.getAll()).rejects.toMatchObject({ code: 'BAD_DATA' })
})

test('мережева помилка перетворюється на помилку сервісу', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

  await expect(animalService.getAll()).rejects.toMatchObject({ code: 'NETWORK' })
})

test('скасування читання не вважається помилкою даних', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(
    new DOMException('Aborted', 'AbortError'),
  ))

  await expect(animalService.getAll()).rejects.toMatchObject({ name: 'AbortError' })
})
