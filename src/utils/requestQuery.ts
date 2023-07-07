import { type UserQueryParams, type UserQueryWithPagination } from '../types'
import { getLimitOffSet } from './pagination'

export const getUserQueryWithPagination = (object: any): UserQueryWithPagination => {
  const { q = '' } = object

  const pagination = getLimitOffSet(object)

  const query: UserQueryParams = { getDeleted: false, q }

  return { ...query, ...pagination }
}

export const getParamsTest = (object: any) => {
  const { experimenter = null } = object

  const params = {
    experimenterId: undefined
  }

  if (experimenter !== null) { params.experimenterId = experimenter }

  return params
}

export const getParamsObjectives = (object: any) => {
  const { label = '' } = object

  return {
    label: label.trim().toUpperCase()
  }
}
