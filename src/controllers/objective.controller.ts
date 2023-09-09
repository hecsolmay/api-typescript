import { type Request, type Response } from 'express'
import * as services from '../services/objective'
import { handleError } from '../utils/errors'
import { toNewObjective } from '../utils/newEntries'
import { getObjectiveQueryWithPagination } from '../utils/requestQuery'
import { toUpdateObjectiveFields } from '../utils/updatedEntries'

export const getAllObjectives = async (req: Request, res: Response) => {
  try {
    const query = getObjectiveQueryWithPagination(req.query)
    const { info, objectives } = await services.getObjectives(query, true)
    return res.json({ message: 'Ok', info, objectives })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getObjectivesNotDeleted = async (req: Request, res: Response) => {
  try {
    const query = getObjectiveQueryWithPagination(req.query)
    const { info, objectives } = await services.getObjectives(query)
    return res.json({ message: 'Ok', info, objectives })
  } catch (error) {
    return handleError(error, res)
  }
}

export const getObjectiveById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const objective = await services.getObjective(id)

    if (objective === null) {
      return res.status(404).json({ message: 'Objective Not Found' })
    }

    return res.json({ message: 'Objective Found', objective })
  } catch (error) {
    return handleError(error, res)
  }
}

export const createObjective = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const { file } = req

    if (file !== undefined) {
      body.content = file.filename
    }

    const objectiveFromRequest = toNewObjective(body)

    const objective = await services.createObjective(objectiveFromRequest)

    return res.status(201).json({ message: 'Objective Created!', objective })
  } catch (error) {
    return handleError(error, res)
  }
}

export const updateObjective = async (req: Request, res: Response) => {
  const { id } = req.params
  const { file, body } = req
  try {
    if (file !== undefined) {
      body.content = file.filename
    }

    const objectiveFromRequest = toUpdateObjectiveFields(body)
    const objectUpdated = await services.updateObjective(id, objectiveFromRequest)

    if (objectUpdated === null) return res.status(404).json({ message: 'Objective Not Found' })

    return res.status(204).json({ message: 'Ok' })
  } catch (error) {
    return handleError(error, res)
  }
}

export const deleteObjective = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const objectiveDeleted = await services.deleteObjective(id)

    if (objectiveDeleted === null) { return res.status(404).json({ message: 'Objective Not Found' }) }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}
export const restoreObjective = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const objectRestored = await services.restoreObjective(id)

    if (objectRestored === null) return res.status(404).json({ message: 'Objective Not Found' })

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}
