import { type NextFunction, type Request, type Response } from 'express'
import { getUserById, searchUser } from '../services/users'
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
