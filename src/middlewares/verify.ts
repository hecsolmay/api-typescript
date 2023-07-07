import { type NextFunction, type Request, type Response } from 'express'
import { searchUser } from '../services/users'
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
