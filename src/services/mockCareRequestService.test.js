import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { mockCareRequestService } from './mockCareRequestService.js'
import { clearAnimalCache } from './animalService.js'
import { animals, validInput } from '../test/fixtures.js'
import seedRequests from '../../public/mock-api/care-requests.json'

const storageKey = 'animal-care.care-requests.v1'

function jsonResponse(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

function stubFiles() {
  const fetchMock = vi.fn().mockImplementation(async (url) => (
    String(url).endsWith('animals.json')
      ? jsonResponse(animals)
      : jsonResponse(seedRequests)
  ))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

async function settle(promise) {
  const result = promise.catch((error) => { throw error })
  await vi.advanceTimersByTimeAsync(600)
  return result
}

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  clearAnimalCache()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

test('поки localStorage порожній, початкові заявки беруться з JSON-файлу', async () => {
  const fetchMock = stubFiles()

  const records = await settle(mockCareRequestService.getAll())

  expect(records).toEqual(seedRequests)
  expect(fetchMock).toHaveBeenCalledWith(
    '/mock-api/care-requests.json',
    expect.anything(),
  )
  expect(localStorage.getItem(storageKey)).toBeNull()
})

test('збережений порожній список не підміняється даними з JSON', async () => {
  const fetchMock = stubFiles()
  localStorage.setItem(storageKey, '[]')

  const records = await settle(mockCareRequestService.getAll())

  expect(records).toEqual([])
  expect(fetchMock).not.toHaveBeenCalled()
})

test('створення додає запис до початкових даних і зберігає в localStorage', async () => {
  stubFiles()

  const created = await settle(mockCareRequestService.create(validInput))

  expect(created.id).toMatch(/^req-/)
  const stored = JSON.parse(localStorage.getItem(storageKey))
  expect(stored).toHaveLength(seedRequests.length + 1)
  expect(stored.at(-1)).toEqual(created)
})

test('невідома тварина відхиляється за довідником з JSON, запис не створюється', async () => {
  stubFiles()

  const promise = mockCareRequestService.create({ ...validInput, animalId: 'an-missing' })
  const assertion = expect(promise).rejects.toMatchObject({ code: 'VALIDATION' })
  await vi.advanceTimersByTimeAsync(600)
  await assertion

  expect(localStorage.getItem(storageKey)).toBeNull()
})

test('відсутній JSON початкових даних дає помилку, а не порожній список', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))

  const promise = mockCareRequestService.getAll()
  const assertion = expect(promise).rejects.toMatchObject({ code: 'NOT_FOUND' })
  await vi.advanceTimersByTimeAsync(600)
  await assertion
})
