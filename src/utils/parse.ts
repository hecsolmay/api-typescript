import { type CONTENT_TYPES } from '../enums'
import { type QuestionCreateDTO, type TestUserCreateDTO } from '../types'
import { ValidationRequestError } from './errors'
import { isArray, isContentType, isEmail, isString } from './validations'

export const parseString = (
  stringFromRequest: any,
  fieldName = 'string'
): string => {
  if (!isString(stringFromRequest)) {
    throw new ValidationRequestError(
      `Incorrect format or missing ${fieldName} field`
    )
  }

  return stringFromRequest
}

export const parseEmail = (stringFromRequest: any): string => {
  if (!isString(stringFromRequest) || !isEmail(stringFromRequest.trim())) {
    throw new ValidationRequestError('Invalid format or missing email field ')
  }

  return stringFromRequest
}

export const parseContentType = (
  contentTypeFromRequest: any
): CONTENT_TYPES => {
  if (
    !isString(contentTypeFromRequest) ||
    !isContentType(contentTypeFromRequest)
  ) {
    throw new ValidationRequestError('Invalid format or missing ContentType ')
  }

  return contentTypeFromRequest
}

export const parseNumber = (
  numberFromRequest: any,
  fieldName = 'number'
): number => {
  const parsedNumber = Number(numberFromRequest)

  if (isNaN(parsedNumber)) {
    throw new ValidationRequestError(
      `Incorrect format or missing ${fieldName} field`
    )
  }

  return parsedNumber
}

export const parseDate = (dateFromRequest: any, fieldName = 'date'): Date => {
  if (
    !(dateFromRequest instanceof Date) &&
    typeof dateFromRequest !== 'string'
  ) {
    throw new ValidationRequestError(`Incorrect or missing ${fieldName} format`)
  }

  const parsedDate = new Date(dateFromRequest)

  if (isNaN(parsedDate.getTime())) {
    throw new ValidationRequestError(`Invalid ${fieldName} format`)
  }

  return parsedDate
}

export const parseArrayQuestions = (array: any): QuestionCreateDTO[] => {
  if (!isArray(array) || array.length === 0) {
    throw new ValidationRequestError(
      'Invalid or missing questions, it was expected an array with object question {stimulusId: string, objectId: strin}'
    )
  }

  const mappedArray: QuestionCreateDTO[] = array.map((question: any) =>
    parseQuestion(question)
  )

  return mappedArray
}

export const parseQuestion = (questionFromRequest: any): QuestionCreateDTO => {
  if (
    !('stimulusId' in questionFromRequest) ||
    !('objectiveId' in questionFromRequest)
  ) {
    throw new ValidationRequestError(
      'Incorrect format question fields stimulusId and objectiveId are requered fields'
    )
  }

  const stimulusId = parseString(questionFromRequest.stimulusId, 'stimulusId')
  const objectiveId = parseString(
    questionFromRequest.objectiveId,
    'objectiveId'
  )

  return {
    stimulusId,
    objectiveId
  }
}

export const parseTestUsers = (testUsersFromRequest: any): TestUserCreateDTO[] => {
  if (testUsersFromRequest === undefined) {
    return []
  }

  if (!isArray(testUsersFromRequest)) {
    throw new ValidationRequestError(
      'Something went wrong it was espected an array with object {userId: string}'
    )
  }

  const mappedUsers: TestUserCreateDTO[] = testUsersFromRequest.map((user: TestUserCreateDTO) => {
    if (!('userId' in user)) {
      throw new ValidationRequestError(
        'Something went wrong it was espected an array with object {userId: string}'
      )
    }

    const userId = parseString(user.userId, 'userId')

    return { userId }
  })

  return mappedUsers
}
