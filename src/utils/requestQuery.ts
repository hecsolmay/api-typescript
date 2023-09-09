import { type ObjectiveQueryWithPagination, type TestQueryParams, type TestQueryWithPagination, type UserQueryParams, type UserQueryWithPagination } from '../types'
import { getLimitOffSet } from './pagination'

export const getUserQueryWithPagination = (object: any): UserQueryWithPagination => {
  const { q = '' } = object

  const pagination = getLimitOffSet(object)

  const query: UserQueryParams = { getDeleted: false, q }

  return { ...query, ...pagination }
}

export const getTestQueryWithPagination = (object: any): TestQueryWithPagination => {
  const { experimenter = null } = object

  const pagination = getLimitOffSet(object)

  const params: TestQueryParams = {}

  if (experimenter !== null) { params.experimenterId = experimenter }

  return { ...params, ...pagination }
}

export const getObjectiveQueryWithPagination = (object: any): ObjectiveQueryWithPagination => {
  const { label = '' } = object

  const pagination = getLimitOffSet(object)

  return {
    ...pagination,
    label
  }
}
