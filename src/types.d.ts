import { type Request } from 'express'
import { type CONTENT_TYPES } from './enums'
import { type ObjectiveAttributes, type TestCommonAtrributes, type UserAttributes, type UserModel, type UserTypesAttributes } from './models/types.d'

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

export interface ObjectiveQueryParams {
  label: string
}

export interface TestQueryParams {
  experimenterId?: string
}

export interface UserQueryWithPagination extends UserQueryParams, PaginationQueryParams {}
export interface ObjectiveQueryWithPagination extends ObjectiveQueryParams, PaginationQueryParams {}
export interface TestQueryWithPagination extends TestQueryParams, PaginationQueryParams {}

// Request For Post Types

export interface CreateUserDTO extends Omit<UserAttributes, 'userId' | 'fullname' | 'rememberToken'> {
  phoneNumber: string | null
  rol?: string
}

export interface RequestWithUser extends Request {
  user: UserModel
  rol: UserTypesAttributes
}

export interface QuestionCreateDTO {
  stimulusId: string
  objectiveId: string
}

export interface TestCommonCreateDTO extends TestCommonAtrributes {
  questions: QuestionCreateDTO[]
}

export interface TestCreateDTO extends TestCommonCreateDTO {
  dateStart: Date
  dateEnd: Date
  practice?: TestCommonCreateDTO
  users?: TestUserCreateDTO[]
}

export type SignInFields = Pick<UserAttributes, 'email' | 'password'>
export interface TestUserCreateDTO {userId: string}
export interface ObjectiveCreateDTO extends Pick<ObjectiveAttributes, 'label' > {contentType: CONTENT_TYPES, content: string}

// Request For Update Types

export type UserUpdateDTO = Partial<CreateUserDTO>
export type ObjectiveUpdateDTO = Partial<ObjectiveCreateDTO>
export interface TestUpdateDTO extends Partial<TestCreateDTO> {
  practice?: Partial<TestCommonCreateDTO>
}
