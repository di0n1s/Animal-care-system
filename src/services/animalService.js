import { fetchJson } from './fetchJson.js'
import { toAnimalList } from './animalContract.js'

const animalsUrl = `${import.meta.env.BASE_URL}mock-api/animals.json`
let loaded = null

export function clearAnimalCache() {
  loaded = null
}

export const animalService = {
  async getAll({ signal } = {}) {
    if (loaded === null) {
      loaded = toAnimalList(await fetchJson(animalsUrl, { signal }))
    }
    return loaded.map((animal) => ({ ...animal }))
  },
}
