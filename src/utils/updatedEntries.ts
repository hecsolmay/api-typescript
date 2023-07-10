import { type TestUpdateDTO, type ObjectiveUpdateDTO, type UserUpdateDTO, type TestCommonCreateDTO } from '../types'
import { toPascalCase } from './format'
import { parseArrayQuestions, parseContentType, parseDate, parseEmail, parseNumber, parseString, parseTestUsers } from './parse'

export const toUpdateUserFields = (object: any): UserUpdateDTO => {
  const updateUser: UserUpdateDTO = {}
  const { name, lastname, email, rol, phoneNumber, password } = object

  if (name !== undefined) {
    updateUser.name = toPascalCase(parseString(object.name, 'name'))
  }

  if (lastname !== undefined) {
    updateUser.lastname = toPascalCase(parseString(object.lastname, 'lastname'))
  }

  if (email !== undefined) {
    updateUser.email = parseEmail(object.email).toLowerCase().trim()
  }

  if (rol !== undefined) {
    updateUser.rol = parseString(object.rol ?? 'user', 'rol')
  }

  if (phoneNumber !== undefined) {
    updateUser.phoneNumber = object.phoneNumber === null ? null : parseString(object.phoneNumber)
  }

  if (password !== undefined) {
    updateUser.password = parseString(object.password, 'password')
  }

  return updateUser
}

export const toUpdateObjectiveFields = (object: any): ObjectiveUpdateDTO => {
  const updateObjective: ObjectiveUpdateDTO = {}

  const { contentType, content, label } = object

  if (contentType !== undefined) {
    updateObjective.contentType = parseContentType(contentType)
  }
  if (content !== undefined) {
    updateObjective.content = parseString(content)
  }
  if (label !== undefined) {
    updateObjective.label = parseString(label).toUpperCase().trim()
  }

  return updateObjective
}

export const toUpdateTest = (object: any): TestUpdateDTO => {
  const { dateStart, dateEnd, practice, users } = object
  const testCommonData = toCommonUpdateTest(object)

  const newTest: TestUpdateDTO = { ...testCommonData }

  if (dateStart !== undefined) newTest.dateStart = parseDate(dateStart, 'dateStart')
  if (dateEnd !== undefined) newTest.dateEnd = parseDate(dateEnd, 'dateEnd')
  if (practice !== undefined) newTest.practice = toCommonUpdateTest(practice)
  if (users !== undefined) newTest.users = parseTestUsers(parseTestUsers)

  return newTest
}

export const toCommonUpdateTest = (object: any): Partial<TestCommonCreateDTO> => {
  const { name, ISI, SOA, pause, isRandom, questions } = object
  const commonTest: Partial<TestCommonCreateDTO> = {}

  if (name !== undefined) commonTest.name = parseString(name, 'name')
  if (SOA !== undefined) commonTest.SOA = parseNumber(SOA, 'SOA')
  if (ISI !== undefined) commonTest.ISI = parseNumber(ISI, 'ISI')
  if (pause !== undefined) commonTest.pause = parseNumber(pause, 'pause')
  if (isRandom !== undefined) commonTest.isRandom = isRandom
  if (questions !== undefined) {
    const parsedQuestions = parseArrayQuestions(questions)
    commonTest.questions = parsedQuestions
    commonTest.questionQuantity = parsedQuestions.length
  }

  return commonTest
}
