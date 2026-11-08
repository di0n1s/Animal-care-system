import { beforeEach, expect, test, vi } from 'vitest'
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { animalService } from './animalService.js'
import { firebaseCareRequestService } from './firebaseCareRequestService.js'
import { animals, savedRequest, validInput } from '../test/fixtures.js'

vi.mock('./firebase.js', () => ({
  db: {},
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'collection-ref'),
  doc: vi.fn((_, col, id) => ({ col, id })),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined),
  })),
}))

vi.mock('./animalService.js', () => ({
  animalService: { getAll: vi.fn() },
}))

beforeEach(() => {
  vi.clearAllMocks()
  animalService.getAll.mockResolvedValue(animals)
})

test('повертає список заявок із колекції Firestore', async () => {
  getDocs.mockResolvedValue({
    empty: false,
    docs: [
      {
        id: savedRequest.id,
        data: () => ({
          animalId: savedRequest.animalId,
          schedule: savedRequest.schedule,
          visitsPerWeek: savedRequest.visitsPerWeek,
          needsSupplies: savedRequest.needsSupplies,
        }),
      },
    ],
  })

  const records = await firebaseCareRequestService.getAll()
  expect(records).toEqual([savedRequest])
})

test('відхиляє запит за відсутнім документом у Firestore з кодом NOT_FOUND', async () => {
  getDoc.mockResolvedValue({
    exists: () => false,
  })

  await expect(firebaseCareRequestService.getById('missing')).rejects.toMatchObject({
    code: 'NOT_FOUND',
    status: 404,
  })
})

test('створює нову заявку у Firestore після валідації полів', async () => {
  setDoc.mockResolvedValue(undefined)

  const created = await firebaseCareRequestService.create({
    ...validInput,
    visitsPerWeek: '2',
  })

  expect(doc).toHaveBeenCalled()
  expect(setDoc).toHaveBeenCalledWith(
    expect.objectContaining({ col: 'careRequests' }),
    expect.objectContaining(validInput),
  )
  expect(created).toMatchObject(validInput)
})

test('видаляє існуючий документ заявки з Firestore', async () => {
  getDoc.mockResolvedValue({
    exists: () => true,
  })
  deleteDoc.mockResolvedValue(undefined)

  await expect(firebaseCareRequestService.delete(savedRequest.id)).resolves.toBeUndefined()
  expect(deleteDoc).toHaveBeenCalledWith(
    expect.objectContaining({ col: 'careRequests', id: savedRequest.id }),
  )
})
