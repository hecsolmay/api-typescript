import { type Request } from 'express'
import { type UserAttributes, type UserModel, type UserTypesAttributes } from './models/types.d'

export interface CreateUserDTO extends Omit<UserAttributes, 'userId' | 'fullname' | 'rememberToken'> {
  phoneNumber: string | null
  rol?: string
}

export interface RequestWithUser extends Request {
  user: UserModel
  rol: UserTypesAttributes
}

export type SignInFields = Pick<UserAttributes, 'email' | 'password'>
