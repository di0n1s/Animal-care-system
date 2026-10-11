import { describe, expect, test } from 'vitest'
import { validateCareRequest } from './careRequestValidation.js'
import { testItem, validInput } from '../test/fixtures.js'

describe('validateCareRequest', () => {
  test('нормалізує коректні поля, не змінюючи вхід', () => {
    const input = Object.freeze({
      ...validInput,
      schedule: ` ${validInput.schedule} `,
      visitsPerWeek: '2',
      id: 'injected-id',
    })

    const result = validateCareRequest(input, [testItem])

    expect(result).toEqual({ ok: true, errors: {}, value: validInput })
    expect(result.value).not.toHaveProperty('id')
    expect(input.visitsPerWeek).toBe('2')
    expect(input.schedule.startsWith(' ')).toBe(true)
  })

  test.each(['', '0', '1.5', '8'])('відхиляє кількість візитів %j', (visitsPerWeek) => {
    const result = validateCareRequest({ ...validInput, visitsPerWeek }, [testItem])

    expect(result.ok).toBe(false)
    expect(result.errors.visitsPerWeek).toBeTruthy()
  })

  test.each([1, 7])('приймає граничну кількість візитів %i', (visitsPerWeek) => {
    const result = validateCareRequest({ ...validInput, visitsPerWeek }, [testItem])

    expect(result.ok).toBe(true)
  })

  test('для понад чотирьох візитів вимагає допомогу з кормом чи ліками', () => {
    const result = validateCareRequest({
      ...validInput, visitsPerWeek: 5, needsSupplies: false,
    }, [testItem])

    expect(result.ok).toBe(false)
    expect(result.errors.needsSupplies).toBeTruthy()
  })

  test('рівно чотири візити не вимагають допомоги', () => {
    const result = validateCareRequest({
      ...validInput, visitsPerWeek: 4, needsSupplies: false,
    }, [testItem])

    expect(result.ok).toBe(true)
  })

  test('відхиляє невідому тварину', () => {
    const result = validateCareRequest({
      ...validInput, animalId: 'an-missing',
    }, [testItem])

    expect(result.errors.animalId).toBeTruthy()
  })

  test.each([9, 501])('відхиляє графік завдовжки %i', (length) => {
    const result = validateCareRequest({
      ...validInput, schedule: 'а'.repeat(length),
    }, [testItem])

    expect(result.errors.schedule).toBeTruthy()
  })

  test.each([10, 500])('приймає графік завдовжки %i', (length) => {
    const result = validateCareRequest({
      ...validInput, schedule: 'а'.repeat(length),
    }, [testItem])

    expect(result.ok).toBe(true)
  })

  test('рядок із самих пробілів вважається порожнім графіком', () => {
    const result = validateCareRequest({
      ...validInput, schedule: '            ',
    }, [testItem])

    expect(result.errors.schedule).toBe('Укажіть бажаний графік догляду.')
  })
})
