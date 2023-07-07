import { type Request, type Response } from 'express'
import * as services from '../services/users'
import { type RequestWithUser } from '../types'
import { handleError } from '../utils/errors'
import { getUserQueryWithPagination } from '../utils/requestQuery'
import { toUpdateUserFields } from '../utils/updatedEntries'

export const getUsers = async (req: Request, res: Response) => {
  const { rol = { name: 'user' } } = (req as RequestWithUser)

  const query = getUserQueryWithPagination(req.query)

  if (rol.name === 'admin') {
    query.getDeleted = true
  }
  try {
    const { users, info } = await services.getAllUsers(query)
    return res.json({ message: 'Ok', info, users })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getUsersNotDeleted = async (req: Request, res: Response) => {
  try {
    const query = getUserQueryWithPagination(req.query)
    const { users, info } = await services.getAllUsers(query, false)
    return res.json({ message: 'Ok', info, users })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await services.getUserById(id)

    if (user === null) {
      return res.status(404).json({ message: 'User Not Found' })
    }
    return res.json({ message: 'User Found', user })
  } catch (error) {
    return handleError(error, res)
  }
}

export const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const usersDeleted = await services.deleteUser(id)

    if (usersDeleted === null) { return res.status(404).json({ message: 'User Not Found' }) }

    return res.status(204).json()
  } catch (error) {
    return handleError(error, res)
  }
}

export const updateById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const userFields = toUpdateUserFields(req.body)
    const updatedUser = await services.updateUser(id, userFields)

    if (updatedUser === 0) {
      return res.status(404).json({ message: 'User Not Found' })
    }

    return res.status(204).json()
  } catch (error) {
    return handleError(error, res)
  }
}

export const restore = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const userRestored = await services.restoreUser(id)

    if (userRestored === null) return res.status(404).json({ message: 'User Not Found' })

    return res.status(204).json({ message: 'Ok' })
  } catch (error) {
    return handleError(error, res)
  }
}
