import { type CreateUserDTO, type SignInFields } from '../types'
import { toPascalCase } from './format'
import { parseString } from './parse'

export const toSignInFields = (object: any): SignInFields => {
  const signIn: SignInFields = {
    email: parseString(object.email, 'email'),
    password: parseString(object.password, 'password')
  }

  return signIn
}

export const toNewUser = (object: any): CreateUserDTO => {
  const parsedName = parseString(object.name, 'name')
  const parsedLastname = parseString(object.lastname, 'lastname')
  const parsedEmail = parseString(object.email, 'email')
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
