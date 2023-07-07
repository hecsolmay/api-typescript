import { type CONTENT_TYPES } from '../enums'
import { ValidationRequestError } from './errors'
import { isContentType, isEmail, isString } from './validations'

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

export const parseContentType = (contentTypeFromRequest: any): CONTENT_TYPES => {
  if (!isString(contentTypeFromRequest) || !isContentType(contentTypeFromRequest)) {
    throw new ValidationRequestError('Invalid format or missing ContentType ')
  }

  return contentTypeFromRequest
}
