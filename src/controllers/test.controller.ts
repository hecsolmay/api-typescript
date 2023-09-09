import { type Request, type Response } from 'express'
import { getExperimentUsers } from '../services/users'
import { type RequestWithUser } from '../types'
import { handleError } from '../utils/errors'
import * as services from '../services/test'
import { toNewTest } from '../utils/newEntries'
import { toUpdateTest } from '../utils/updatedEntries'

export const getAllTest = async (req: Request, res: Response) => {
  try {
    const { rol = { name: 'user' }, user } = (req as RequestWithUser)

    if (rol.name === 'experimenter') {
      req.query.experimenter = user.userId
    }
    const { test, info } = await services.getTests(req.query, true)
    return res.json({ message: 'Ok', info, test })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getNotDeletedTest = async (req: Request, res: Response) => {
  try {
    const { rol = { name: 'user' }, user } = (req as RequestWithUser)

    if (rol.name === 'experimenter') {
      req.query.experimenter = user.userId
    }

    const { test, info } = await services.getTests(req.query, false)
    return res.json({ message: 'Ok', info, test })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getTest = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const { test, users } = await services.getTestById(id)

    if (test === null) {
      return res.status(404).json({ message: 'Test Not Found' })
    }
    return res.json({ message: 'Test Found', test, users })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getDetailsTest = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const test = await services.getTestById(id)

    if (test.test === null) {
      return res.status(404).json({ message: 'Test Not Found' })
    }
    const users = await getExperimentUsers(id)

    return res.json({ message: 'Test Details', test, users })
  } catch (error) {
    return handleError(error, res)
  }
}

export const createTest = async (req: Request, res: Response) => {
  const { user } = (req as RequestWithUser)
  try {
    const parsedBody = toNewTest(req.body)
    const test = await services.createTest(parsedBody, user.userId ?? '')
    return res.json({ message: 'Create Test', test })
  } catch (error) {
    return handleError(error, res)
  }
}

export const updatedTest = async (req: Request, res: Response) => {
  const { user } = (req as RequestWithUser)
  const { id } = req.params
  try {
    const parsedUpdate = toUpdateTest(req.body)
    const updatedTest = await services.updateById(id, parsedUpdate, user.userId ?? '')
    if (updatedTest === null) {
      return res.status(404).json({ message: 'Test Not Found' })
    }
    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export const deleteTest = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const testDeleted = await services.deletedById(id)

    if (testDeleted === null) { return res.status(404).json({ message: 'Test Not Found' }) }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export const restore = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const testRestored = await services.restoreById(id)

    if (testRestored === null) return res.status(404).json({ message: 'Test Not Found' })

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}
