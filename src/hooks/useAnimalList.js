import { useEffect, useState } from 'react'
import { animalService } from '../services/animalService.js'
import { errorMessage } from '../services/ServiceError.js'

export default function useAnimalList() {
  const [state, setState] = useState({ status: 'loading', animals: [], error: '' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const animals = await animalService.getAll({ signal: controller.signal })
        if (!controller.signal.aborted) {
          setState({ status: 'success', animals, error: '' })
        }
      } catch (cause) {
        if (controller.signal.aborted) return
        setState({ status: 'error', animals: [], error: errorMessage(cause) })
      }
    }

    void load()
    return () => controller.abort()
  }, [attempt])

  function reload() {
    setState((previous) => ({ ...previous, status: 'loading', error: '' }))
    setAttempt((value) => value + 1)
  }

  return { ...state, reload }
}
