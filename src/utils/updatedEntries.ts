import { type UserUpdateDTO } from '../types'
import { toPascalCase } from './format'
import { parseEmail, parseString } from './parse'

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
