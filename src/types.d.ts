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

export interface PaginationInfo {
  currentPage: number
  limit: number
  totalResults: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: number | null
  prevPage: number | null
}

export interface PaginationQueryParams {
  limit: number
  page: number
  offset: number
}

export interface UserQueryParams {
  q: string
  getDeleted: boolean
}

export interface UserQueryWithPagination extends UserQueryParams, PaginationQueryParams {}
export type UserUpdateDTO = Partial<CreateUserDTO>
export type SignInFields = Pick<UserAttributes, 'email' | 'password'>
