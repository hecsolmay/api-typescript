import { ValidationRequestError } from './errors'
import { isEmail, isString } from './validations'

export const parseString = (stringFromRequest: any, fieldName = 'string'): string => {
  if (!isString(stringFromRequest)) {
    throw new ValidationRequestError(`Incorrect or missing ${fieldName} format`)
  }

  return stringFromRequest
}

export const parseEmail = (stringFromRequest: any): string => {
  if (!isString(stringFromRequest) || !isEmail(stringFromRequest.trim())) {
    throw new ValidationRequestError('Invalid format or missing email field ')
  }

  return stringFromRequest
}
