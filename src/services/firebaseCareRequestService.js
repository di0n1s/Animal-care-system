import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { ServiceError } from './ServiceError.js'
import { animalService } from './animalService.js'
import {
  toCareRequest,
  toCareRequestInput,
  toCareRequestList,
} from './careRequestContract.js'
import { fetchJson } from './fetchJson.js'
import { db } from './firebase.js'

const collectionName = 'careRequests'
const seedUrl = `${import.meta.env.BASE_URL}mock-api/care-requests.json`

function checkAborted(signal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError')
  }
}

function handleFirestoreError(error) {
  if (error instanceof ServiceError || error?.name === 'AbortError') {
    throw error
  }
  throw new ServiceError('Не вдалося виконати запит до Firebase Firestore.', {
    code: 'NETWORK',
  })
}

async function seedInitialRecords(signal) {
  const seeded = toCareRequestList(await fetchJson(seedUrl, { signal }))
  checkAborted(signal)
  const batch = writeBatch(db)
  for (const record of seeded) {
    batch.set(doc(db, collectionName, record.id), record)
  }
  await batch.commit()
  return seeded.map((record) => ({ ...record }))
}

export const firebaseCareRequestService = {
  async getAll({ signal } = {}) {
    checkAborted(signal)
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      checkAborted(signal)
      if (snapshot.empty) {
        return await seedInitialRecords(signal)
      }
      const items = snapshot.docs.map((entry) => ({
        ...entry.data(),
        id: entry.id,
      }))
      return toCareRequestList(items)
    } catch (error) {
      handleFirestoreError(error)
    }
  },

  async getById(id, { signal } = {}) {
    checkAborted(signal)
    try {
      const snapshot = await getDoc(doc(db, collectionName, id))
      checkAborted(signal)
      if (!snapshot.exists()) {
        throw new ServiceError('Заявку не знайдено.', {
          code: 'NOT_FOUND',
          status: 404,
        })
      }
      return toCareRequest({ ...snapshot.data(), id: snapshot.id })
    } catch (error) {
      handleFirestoreError(error)
    }
  },

  async create(input) {
    const value = toCareRequestInput(input, await animalService.getAll())
    const id = `req-${crypto.randomUUID()}`
    const record = { ...value, id }
    try {
      await setDoc(doc(db, collectionName, id), record)
      return toCareRequest(record)
    } catch (error) {
      handleFirestoreError(error)
    }
  },

  async update(id, input) {
    const value = toCareRequestInput(input, await animalService.getAll())
    const ref = doc(db, collectionName, id)
    try {
      const snapshot = await getDoc(ref)
      if (!snapshot.exists()) {
        throw new ServiceError('Заявку не знайдено.', {
          code: 'NOT_FOUND',
          status: 404,
        })
      }
      const record = { ...value, id }
      await setDoc(ref, record)
      return toCareRequest(record)
    } catch (error) {
      handleFirestoreError(error)
    }
  },

  async delete(id) {
    const ref = doc(db, collectionName, id)
    try {
      const snapshot = await getDoc(ref)
      if (!snapshot.exists()) {
        throw new ServiceError('Заявку не знайдено.', {
          code: 'NOT_FOUND',
          status: 404,
        })
      }
      await deleteDoc(ref)
    } catch (error) {
      handleFirestoreError(error)
    }
  },
}
