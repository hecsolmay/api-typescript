import { type NextFunction, type Request, type Response } from 'express'
import { Op } from 'sequelize'
import { TEST_STATUS } from '../enums'
import Test from '../models/Tests'
import { TestUsers } from '../models/UnionTables'
import { getUserById, searchUser } from '../services/users'
import { type RequestWithUser } from '../types'
import { handleError } from '../utils/errors'
import { parseEmail } from '../utils/parse'

export const checkDuplicateEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = parseEmail(req.body.email)

    const user = await searchUser(email.toLowerCase().trim())

    if (user !== null) {
      return res.status(409).json({ message: 'Conflict, email already register' })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    return handleError(error, res)
  }
}

export const checkUpdateEmailNotConfic = async (req: Request, res: Response, next: NextFunction) => {
  const { id = undefined } = req.params
  const emailFromRequest = req.body.email
  try {
    if (emailFromRequest !== undefined && id !== undefined) {
      const previousUserData = await getUserById(id)

      if (previousUserData === null) return res.status(404).json({ message: 'User Not Found' })

      const email = parseEmail(emailFromRequest)
      if (previousUserData.email !== email.trim().toLowerCase()) {
        const searchedUser = await searchUser(email.trim().toLowerCase())

        if (searchedUser !== null) return res.status(409).json({ message: 'Conflict, email already register' })
      }
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    return handleError(error, res)
  }
}

export const verifyTestStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const test = await Test.findByPk(id)

    if (test === null) {
      return res.status(404).json({ message: 'Test Not Found' })
    }

    const { status } = test

    if (status !== TEST_STATUS.ONGOING) {
      const message = status === TEST_STATUS.COMPLETE ? "You can't access to a test already complete" : "You can't access to a test not started"
      return res.status(400).json({ message, status })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    return handleError(error, res)
  }
}

export const verifyTestUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { user } = (req as RequestWithUser)
  try {
    const testUser = await TestUsers.findOne({
      where: {
        [Op.and]: [
          { userId: user.userId },
          { testId: id }
        ]
      }
    })

    if (testUser === null) {
      return res.status(404).json({ message: `No se encontro ningun test asignado al usuario ${user.email}` })
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    return handleError(error, res)
  }
}
