import { ValidationRequestError } from './errors'
import { isString } from './validations'

export const parseString = (stringFromRequest: any, fieldName = 'string'): string => {
  if (!isString(stringFromRequest)) {
    throw new ValidationRequestError(`Incorrect or missing ${fieldName}`)
  }

  return stringFromRequest
}
