import { type CreateUserDTO, type ObjectiveCreateDTO, type SignInFields, type TestCommonCreateDTO, type TestCreateDTO } from '../types'
import { toPascalCase } from './format'
import { parseArrayQuestions, parseContentType, parseDate, parseEmail, parseNumber, parseString, parseTestUsers } from './parse'

export const toSignInFields = (object: any): SignInFields => {
  const signIn: SignInFields = {
    email: parseEmail(object.email),
    password: parseString(object.password, 'password')
  }

  return signIn
}

export const toNewUser = (object: any): CreateUserDTO => {
  const parsedName = parseString(object.name, 'name')
  const parsedLastname = parseString(object.lastname, 'lastname')
  const parsedEmail = parseEmail(object.email)
  const password = parseString(object.password, 'password')
  const rol = parseString(object.rol ?? 'user', 'rol')
  const phoneNumber = object.phoneNumber != null ? parseString(object.phoneNumber) : null

  const signUp: CreateUserDTO = {
    name: toPascalCase(parsedName),
    lastname: toPascalCase(parsedLastname),
    email: parsedEmail.toLowerCase().trim(),
    password,
    rol,
    phoneNumber
  }

  return signUp
}

export const toNewObjective = (object: any): ObjectiveCreateDTO => {
  const label = parseString(object.label, 'label').toUpperCase().trim()
  const contentType = parseContentType(object.contentType)
  const content = parseString(object.content, 'content')

  return {
    content,
    contentType,
    label
  }
}

export const toNewTest = (object: any): TestCreateDTO => {
  const currentDate = new Date()

  const testAtrributes = toNewCommonTest(object)

  const dateStart = parseDate(object.dateStart ?? currentDate, 'dateStart')
  const nextMonthDate = new Date(dateStart.getTime() + 30 * 24 * 60 * 60 * 1000)
  const dateEnd = parseDate(object.dateEnd ?? nextMonthDate, 'dateEnd')
  const practice = object.practice !== undefined ? toNewCommonTest(object.practice) : undefined
  const users = parseTestUsers(object.users)

  const newTest: TestCreateDTO = {
    ...testAtrributes,
    dateStart,
    dateEnd,
    practice,
    users
  }

  return newTest
}

export const toNewCommonTest = (object: any): TestCommonCreateDTO => {
  const name = parseString(object.name, 'name')
  const ISI = parseNumber(object.ISI, 'ISI')
  const SOA = parseNumber(object.SOA, 'SOA')
  const pause = parseNumber(object.pause, 'pause')
  const isRandom = object.isRandom ?? false
  const questions = parseArrayQuestions(object.questions)

  const newCommonTest: TestCommonCreateDTO = {
    name,
    ISI,
    SOA,
    pause,
    isRandom,
    questions,
    questionQuantity: questions.length
  }

  return newCommonTest
}
